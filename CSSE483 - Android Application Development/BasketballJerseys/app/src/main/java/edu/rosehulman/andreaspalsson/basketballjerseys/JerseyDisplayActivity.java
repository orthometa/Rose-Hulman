package edu.rosehulman.andreaspalsson.basketballjerseys;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.ToggleButton;


public class JerseyDisplayActivity extends Activity {
    public static final String JDA ="JDA";
    private ImageView mJerseyImageView;
    private TextView mNameTextView;
    private TextView mNumberTextView;
    private boolean mJerseyIsRed = true;

    public static final String KEY_PLAYER_NAME = "KEY_PLAYER_NAME";
    public static final String KEY_PLAYER_NUMBER = "KEY_PLAYER_NUMBER";
    public static final String KEY_JERSEY_IS_RED = "KEY_JERSEY_IS_RED";
    private static final int REQUEST_CODE_JERSEY_INFO = 1;

    public static final int RESULT_OK = 0;
    public static final int RESULT_CANCEL = 1;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_jersey_display);

        mJerseyImageView = (ImageView) findViewById(R.id.jersey_image);
        mNameTextView = (TextView) findViewById(R.id.jersey_name_display);
        mNumberTextView = (TextView) findViewById(R.id.jersey_number_display);

        ((Button) findViewById(R.id.jersey_display_edit_button)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(JerseyDisplayActivity.this, JerseyInfoActivity.class);

                i.putExtra(JerseyDisplayActivity.KEY_PLAYER_NAME, mNameTextView.getText().toString());
                i.putExtra(JerseyDisplayActivity.KEY_PLAYER_NUMBER, "" + mNumberTextView.getText().toString());
                i.putExtra(JerseyDisplayActivity.KEY_JERSEY_IS_RED, mJerseyIsRed);

                startActivityForResult(i, REQUEST_CODE_JERSEY_INFO);
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if(resultCode == RESULT_OK) {
            updateJerseyInfo(data.getExtras().getString(KEY_PLAYER_NAME), data.getExtras().getString(KEY_PLAYER_NUMBER), data.getExtras().getBoolean(KEY_JERSEY_IS_RED, false));
        }
    }

    private void updateJerseyInfo(String name, String number, boolean jerseyIsRed) {
        mJerseyIsRed = jerseyIsRed;
        if (jerseyIsRed)
            mJerseyImageView.setImageDrawable(getResources().getDrawable(R.drawable.red_jersey));
        else
            mJerseyImageView.setImageDrawable(getResources().getDrawable(R.drawable.blue_jersey));

        mNameTextView.setText(name);
        mNumberTextView.setText(number);
    }

}
