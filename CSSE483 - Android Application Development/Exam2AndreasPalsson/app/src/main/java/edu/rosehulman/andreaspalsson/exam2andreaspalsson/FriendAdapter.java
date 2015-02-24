package edu.rosehulman.andreaspalsson.exam2andreaspalsson;

import android.app.Activity;
import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.List;

/**
 * Created by palssoa on 1/18/2015.
 */
public class FriendAdapter extends ArrayAdapter<Friend> {

    private Context context;

    public FriendAdapter(Context context, List<Friend> friends) {
        super(context, R.layout.row_view, friends);
        this.context = context;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        // Recycles the convertView if it can.
        if(convertView == null)
            convertView = ((Activity) context).getLayoutInflater().inflate(R.layout.row_view, null);

        Friend friend = getItem(position);
        ((TextView) convertView.findViewById(R.id.name)).setText(friend.getName());
        ((TextView) convertView.findViewById(R.id.time)).setText(friend.getHour() + ":" + (friend.getMinute() > 10 ? friend.getMinute() : "0" + friend.getMinute()));
        return convertView;
    }
}
