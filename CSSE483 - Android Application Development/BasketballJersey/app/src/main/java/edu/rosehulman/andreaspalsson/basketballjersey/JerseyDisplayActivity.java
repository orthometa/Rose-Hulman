package edu.rosehulman.andreaspalsson.basketballjersey;

import android.app.Activity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.ImageView;
import android.widget.TextView;


public class JerseyDisplayActivity extends Activity {
    public static final String JDA ="JDA";
    private ImageView mJerseyImageView;
    private TextView mNameTextView;
    private TextView mNumberTextView;
    private String mPlayerName = "Fisher";
    private int mPlayerNumber = 42;
    private boolean mJerseyIsRed = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_jersey_display);

        mJerseyImageView = (ImageView) findViewById(R.id.jersey_image);
        mNameTextView = (TextView) findViewById(R.id.jersey_name_display);
        mNumberTextView = (TextView) findViewById(R.id.jersey_number_display);

    }

    private void updateJerseyInfo() {
        if (mJerseyIsRed)
            mJerseyImageView.setImageDrawable(getResources().getDrawable(R.drawable.red_jersey));
        else
            mJerseyImageView.setImageDrawable(getResources().getDrawable(R.drawable.blue_jersey));
    }

}
