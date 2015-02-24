package edu.rosehulman.andreaspalsson.listviewandreaspalsson;

import android.app.Activity;
import android.content.Context;
import android.widget.LinearLayout;
import android.widget.TextView;

/**
 * Created by palssoa on 1/15/2015.
 */
public class RowView extends LinearLayout {

    private TextView mLeftTextView;
    private TextView mRightTextView;

    public RowView(Context context) {
        super(context);
        ((Activity) context).getLayoutInflater().inflate(R.layout.row_view, this);
        mLeftTextView = (TextView) findViewById(R.id.left_text_view);
        mRightTextView = (TextView) findViewById(R.id.right_text_view);
    }

    public void setLeftText(String text) {
        mLeftTextView.setText(text);
    }

    public void setRightText(String text) {
        mRightTextView.setText(text);
    }
}
