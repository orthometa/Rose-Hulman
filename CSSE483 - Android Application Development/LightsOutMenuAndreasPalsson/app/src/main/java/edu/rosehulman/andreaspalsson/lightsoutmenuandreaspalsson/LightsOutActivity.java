package edu.rosehulman.andreaspalsson.lightsoutmenuandreaspalsson;

import android.app.Activity;
import android.content.Intent;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;

import java.util.ArrayList;


public class LightsOutActivity extends Activity implements View.OnClickListener {

    private int mNumButtons;
    private LightsOutGame mGame;
    private ArrayList<Button> mButtons;
    private TextView textView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_lights_out);


        Intent data = getIntent();
        mNumButtons = data.getIntExtra(MainActivity.KEY_NUM_BUTTONS, 7);
        Log.d(MainActivity.LOM, "Got " + mNumButtons + " buttons.");

        mGame = new LightsOutGame(mNumButtons);
        mButtons = new ArrayList<Button>();
        TableRow buttonRow = new TableRow(this);
        System.out.println("AAA NUMBE OF BUTONS: " + mNumButtons);
        for(int i = 0; i < this.mNumButtons; i++) {
            Button button = new Button(this);
            button.setTag(Integer.valueOf(i));
            button.setText("" + mGame.getValueAtIndex(i));
            mButtons.add(button);
            buttonRow.addView(button);
            button.setOnClickListener(this);
        }
        TableLayout buttonTable = (TableLayout) findViewById(R.id.button_table);
        buttonTable.addView(buttonRow);
        Button newGame = (Button) findViewById(R.id.new_game_button);
        newGame.setOnClickListener(this);

        textView = (TextView) findViewById(R.id.game_state);

// Create a model using the number of buttons

    }

    @Override
    public void onClick(View v) {
        if(v.getId() == R.id.new_game_button) {
            Log.d(MainActivity.LOM, "New game pressed");
            this.mGame = new LightsOutGame(this.mNumButtons);
        } else {
            Log.d(MainActivity.LOM, "Button with tag " + v.getTag());
            this.mGame.pressedButtonAtIndex((Integer) v.getTag());
        }

        updateView();
    }

    private void updateView() {
        boolean win = mGame.checkForWin();

        for (int i = 0; i < mNumButtons; i++) {
            mButtons.get(i).setText("" + mGame.getValueAtIndex(i));
            mButtons.get(i).setEnabled(!win);
        }

        int nMoves = mGame.getNumPresses();
        String s;
        if (win) {
            if (nMoves == 1) {
                s = getString(R.string.you_won_one_move);
            } else {
                s = getString(R.string.you_won_format, nMoves);
            }
        } else {
            if (nMoves == 1) {
                s = getString(R.string.game_one_move);
            } else {
                s = getString(R.string.game_format, nMoves);
            }
        }
        textView.setText(s);
    }
}
