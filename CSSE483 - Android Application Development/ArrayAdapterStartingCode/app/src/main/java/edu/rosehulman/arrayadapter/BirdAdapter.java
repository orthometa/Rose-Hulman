package edu.rosehulman.arrayadapter;

import android.content.Context;
import android.graphics.Color;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.ArrayList;

public class BirdAdapter extends ArrayAdapter<StateBird> {
    // For info about the expandable list, see here:
// https://github.com/android/platform_frameworks_base/blob/
    // master/core/res/res/layout/simple_expandable_list_item_2.xml

    public BirdAdapter(Context context, ArrayList<StateBird> birds) {
        super(context, android.R.layout.simple_expandable_list_item_2,
                android.R.id.text1, birds);
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        // Recycles the convertView if it can.
        View view = super.getView(position, convertView, parent);

        // Fill the view with data
        StateBird bird = getItem(position);
        TextView nameTextView = (TextView) view.findViewById(android.R.id.text1);
        nameTextView.setTextColor(Color.YELLOW);
        nameTextView.setText(bird.getName());
        TextView stateTextView = (TextView) view.findViewById(android.R.id.text2);
        stateTextView.setText(bird.getState());
        return view;
    }
}