package edu.rosehulman.andreaspalsson.exam2andreaspalsson;

import android.graphics.Color;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.TypedValue;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ListView;
import android.widget.TextView;

import java.util.ArrayList;


public class FriendActivity extends ActionBarActivity {

    private ArrayList<Friend> friends;
    private ListView mListView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_friend);
        friends = getIntent().getParcelableArrayListExtra(MainActivity.FRIEND_KEY);
        mListView = (ListView) findViewById(R.id.friend_list_view);
        mListView.setDividerHeight(0);
        mListView.setAdapter(new BaseAdapter() {
            @Override
            public int getCount() {
                return friends.size();
            }

            @Override
            public Object getItem(int position) {
                return friends.get(position);
            }

            @Override
            public long getItemId(int position) {
                return 0;
            }

            @Override
            public View getView(int position, View convertView, ViewGroup parent) {
                TextView view;
                if (convertView == null) {
                    view = new TextView(FriendActivity.this);
                    view.setTextSize(TypedValue.COMPLEX_UNIT_SP, 18);
                } else {
                    view = (TextView) convertView;
                }
                view.setText(friends.get(position).getName());
                view.setTextColor(Color.rgb(position * 10, 255 - position * 10, 200));
                return view;
            }
        });


    }

}
