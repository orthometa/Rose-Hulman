package edu.rosehulman.andreaspalsson.exam2andreaspalsson;

import android.app.AlertDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.content.DialogInterface;
import android.content.Intent;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.ActionMode;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AbsListView;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TimePicker;

import java.util.ArrayList;

public class MainActivity extends ActionBarActivity {

    public static final String FRIEND_KEY = "FRIEND_KEY";
    public static final String CHOSEN_FRIENDS_KEY = "CHOSEN_FRIENDS_KEY";

    private ListView mListView;
    private FriendAdapter adapter;
    private ArrayList<Friend> mFriends;
    private ArrayList<Friend> mChosenFriends;
    private int mNumChosenFriends = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (savedInstanceState != null) {
            mFriends = savedInstanceState.getParcelableArrayList(FRIEND_KEY);
            mChosenFriends = savedInstanceState.getParcelableArrayList(CHOSEN_FRIENDS_KEY);
            mNumChosenFriends = mChosenFriends.size();

        } else {
            mFriends = new ArrayList<Friend>();
            mChosenFriends = new ArrayList<Friend>();
            mNumChosenFriends = 0;

        }
        adapter = new FriendAdapter(this, mFriends);
        adapter.setNotifyOnChange(true);

        setContentView(R.layout.activity_main);
        mListView = (ListView) findViewById(R.id.list_view);


        mListView.setAdapter(adapter);
        mListView.setChoiceMode(ListView.CHOICE_MODE_MULTIPLE_MODAL);


            mListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                @Override
                public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                    createDeleteFriendDialog(position);
                }
            });

            mListView.setMultiChoiceModeListener(new AbsListView.MultiChoiceModeListener() {

                @Override
                public void onItemCheckedStateChanged(ActionMode mode, int position,
                                                      long id, boolean checked) {
                    // Here you can do something when items are selected/de-selected,
                    // such as update the title in the CAB
                    if (checked) {
                        mode.setSubtitle(getString(R.string.chose, ++mNumChosenFriends));
                        mChosenFriends.add(mFriends.get(position));
                        return;
                    }

                    mChosenFriends.remove(mFriends.get(position));
                    mode.setSubtitle(getString(R.string.chose, --mNumChosenFriends));
                }

                @Override
                public boolean onActionItemClicked(ActionMode mode, MenuItem item) {
                    // Respond to clicks on the actions in the CAB
                    switch (item.getItemId()) {
                        case R.id.open_activity:
                            Intent i = new Intent(MainActivity.this, FriendActivity.class);
                            i.putParcelableArrayListExtra(FRIEND_KEY, mChosenFriends);
                            startActivity(i);
                            return true;
                        default:
                            return false;
                    }
                }

                @Override
                public boolean onCreateActionMode(ActionMode mode, Menu menu) {
                    // Inflate the menu for the CAB
                    MenuInflater inflater = mode.getMenuInflater();
                    inflater.inflate(R.menu.context, menu);
                    mode.setTitle(getString(R.string.choose_your_friends));
                    return true;
                }

                @Override
                public void onDestroyActionMode(ActionMode mode) {
                    mChosenFriends.clear();
                    mNumChosenFriends = 0;
                }

                @Override
                public boolean onPrepareActionMode(ActionMode mode, Menu menu) {
                    // Here you can perform updates to the CAB due to
                    // an invalidate() request
                    return false;
                }
            });

        }

    @Override
    protected void onSaveInstanceState(Bundle outState){

        outState.putParcelableArrayList(FRIEND_KEY, mFriends);
        outState.putParcelableArrayList(CHOSEN_FRIENDS_KEY, mChosenFriends);
        super.onSaveInstanceState(outState);
    }



    private void createDeleteFriendDialog(final int position) {
        DialogFragment df = new DialogFragment() {
            @Override
            public Dialog onCreateDialog(Bundle savedInstanceState) {
                return new AlertDialog.Builder(getActivity())
                        .setTitle(getString(R.string.confirm_deletion))
                        .setMessage(getString(R.string.confirm_deletion_message))
                        .setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                mFriends.remove(position);
                                adapter.notifyDataSetChanged();
                            }
                        })
                        .setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener() {

                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                dismiss();
                            }
                        })
                        .create();
            }
        };
        df.show(getFragmentManager(), getString(R.string.delete_friend));
    }




    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        if (id == R.id.add_friend) {
            createAddFriendDialog();
        }
        return true;
    }

    private void createAddFriendDialog() {
        DialogFragment df = new DialogFragment() {

            @Override
            public Dialog onCreateDialog(Bundle savedInstanceState) {
                AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
                builder.setTitle(getString(R.string.add_your_friend));
                final View v = getActivity().getLayoutInflater().inflate(R.layout.dialog_add_friend, null);
                builder.setView(v);
                builder.setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        String name = ((EditText) v.findViewById(R.id.edittext_name)).getText().toString();
                        Integer hour = ((TimePicker) v.findViewById(R.id.timePicker)).getCurrentHour();
                        Integer minute = ((TimePicker) v.findViewById(R.id.timePicker)).getCurrentMinute();
                        addFriend(name, hour, minute);
                        dismiss();
                    }
                });
                builder.setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dismiss();
                    }
                });
                return builder.create();
            }
        };
        df.show(getFragmentManager(), getString(R.string.add_friend));
    }

    public void addFriend(String name, Integer hour, Integer minute) {
        mFriends.add(new Friend(name, hour, minute));
        adapter.notifyDataSetChanged();
    }
}
