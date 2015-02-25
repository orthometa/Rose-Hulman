package edu.rosehulman.andreaspalsson.finalexampalssoa;

import android.app.AlertDialog;
import android.app.ListActivity;
import android.content.DialogInterface;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;

import com.appspot.csse483_hangman.gameservice.Gameservice;
import com.appspot.csse483_hangman.gameservice.model.Hangman;
import com.appspot.csse483_hangman.gameservice.model.HangmanCollection;
import com.google.api.client.extensions.android.http.AndroidHttp;
import com.google.api.client.json.gson.GsonFactory;

import java.io.IOException;
import java.util.ArrayList;


public class MainActivity extends ListActivity {

    private Gameservice mService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mService = new Gameservice(AndroidHttp.newCompatibleTransport(), new GsonFactory(), null);
        getListView().setOnItemLongClickListener(new AdapterView.OnItemLongClickListener() {
            @Override
            public boolean onItemLongClick(AdapterView<?> parent, View view, int position, long id) {
                showDeleteDialog(position);
                return true;
            }
        });
        updateList();
    }

    private void showDeleteDialog(int position) {
        final Hangman hangman = (Hangman) getListAdapter().getItem(position);
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle(getString(R.string.delete));
        builder.setMessage(getString(R.string.are_you_sure));

        builder.setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                new DeleteGameTask().execute(hangman.getEntityKey());
            }
        });
        builder.setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
            }
        });
        builder.create().show();
    }

    private void updateList() {
        new QueryForGames().execute();
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        switch (id) {
            case R.id.add_game:
                showAddGameDialog();
                break;
            case R.id.sync:
                updateList();
                break;
        }


        return super.onOptionsItemSelected(item);
    }

    @Override
    protected void onListItemClick(ListView l, View v, int position, long id) {
        showGuessDialog(position);
        super.onListItemClick(l, v, position, id);
    }

    private void showGuessDialog(int position) {
        final Hangman hangman = (Hangman) getListAdapter().getItem(position);
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle(getString(R.string.guess_a_letter));
        final View v = getLayoutInflater().inflate(R.layout.dialog_guess, null);

        ((TextView) v.findViewById(R.id.word)).setText(getString(R.string.word, hangman.getDisplayWord()));
        ((TextView) v.findViewById(R.id.guesses)).setText(getString(R.string.guesses, hangman.getGuesses()));
        builder.setView(v);

        builder.setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                String guess = ((EditText) v.findViewById(R.id.guess_edittext)).getText().toString();
                hangman.setGuesses(hangman.getGuesses() + guess);
                new InsertGameTask().execute(hangman);
            }
        });
        builder.setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
            }
        });
        builder.create().show();
    }

    private void showAddGameDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle(getString(R.string.add_game));
        final View v = getLayoutInflater().inflate(R.layout.dialog_add, null);
        builder.setView(v);

        builder.setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Hangman h = new Hangman();
                h.setCreator(((EditText) v.findViewById(R.id.game_creator_edittext)).getText().toString());
                h.setSecretWord(((EditText) v.findViewById(R.id.secret_word_edittext)).getText().toString());
                new InsertGameTask().execute(h);
            }
        });
        builder.setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
            }
        });
        builder.create().show();
    }



    class QueryForGames extends AsyncTask<Void, Void, HangmanCollection> {

        @Override
        protected HangmanCollection doInBackground(Void... arg0) {
            HangmanCollection games = null;
            try {
                Gameservice.Hangman.List query = mService.hangman().list();
                query.setOrder("-last_touch_date_time");
                query.setLimit(50L);
                games = query.execute();
            } catch(IOException e) {
                Log.e("QQ", "Failed loading " + e);
            }
            return games;
        }

        @Override
        protected void onPostExecute(HangmanCollection result) {
            super.onPostExecute(result);
            if(result == null) {
                Log.d("QQ", "Failed loading, result is null");
                return;
            }
            HangmanAdapter adapter;
            if(result.getItems() != null) {
                adapter = new HangmanAdapter(MainActivity.this, R.layout.row_view, result.getItems());
            } else {
                adapter = new HangmanAdapter(MainActivity.this, R.layout.row_view, new ArrayList<Hangman>());
            }

            setListAdapter(adapter);
        }

    }

    class InsertGameTask extends AsyncTask<Hangman, Void, Hangman> {

        @Override
        protected Hangman doInBackground(Hangman... quotes) {
            Hangman returnedQuote = null;
            try {
                returnedQuote = mService.hangman().insert(quotes[0]).execute();
            } catch (IOException e) {
                Log.e("QQ", "Failed inserting: " + e);
            }
            return returnedQuote;
        }

        @Override
        protected void onPostExecute(Hangman result) {
            super.onPostExecute(result);
            if(result == null) {
                Log.e("QQ", "Insert failed, result is null");
            }
            updateList();
        }
    }

    class DeleteGameTask extends AsyncTask<String, Void, Hangman> {

        @Override
        protected Hangman doInBackground(String... entityKeys) {

            Hangman returnedGame = null;
            try {
                returnedGame = mService.hangman().delete(entityKeys[0]).execute();
            } catch (IOException e) {
                Log.e("QQ", "Failed deleting: " + e);
            }
            return returnedGame;
        }

        @Override
        protected void onPostExecute(Hangman result) {
            super.onPostExecute(result);
            if(result == null) {
                Log.e("QQ", "Insert failed, result is null");
            }
            updateList();
        }


    }
}
