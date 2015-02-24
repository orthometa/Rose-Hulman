package edu.rosehulman.andreaspalsson.listviewandreaspalsson;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

public class RowNumberAdapter extends BaseAdapter {

    private Context mContext;
    private int mNumRows = 5;
    private String[] mMonths;

    public RowNumberAdapter(Context context) {
        this.mContext = context;
        this.mMonths = context.getResources().getStringArray(R.array.monthNames);
    }
    @Override
    public int getCount() {
        return mNumRows;
    }

    @Override
    public Object getItem(int position) {
        return this.mMonths[position % 12];
    }

    @Override
    public long getItemId(int position) {
        return 0;
    }
    public void addView() {
        mNumRows++;
    }

 /*   @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        TextView view;
        if (convertView == null) {
            view = new TextView(this.mContext);
            view.setTextSize(24);
        } else {
            view = (TextView) convertView;
        }

        view.setText("  Row " + position);
        return view;
    }*/
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        RowView view;
        if (convertView == null) {
            view = new RowView(mContext);
        } else {
            view = (RowView) convertView;
        }
        view.setLeftText(" " + (position + 1) + ". ");
        view.setRightText(mMonths[position % 12]);
        return view;
    }
}