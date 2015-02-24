package edu.rosehulman.andreaspalsson.basketballjerseys;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import android.widget.ToggleButton;


public class JerseyInfoActivity extends Activity {

    private EditText mNameEditText;
    private EditText mNumberEditText;
    private ToggleButton mJerseyIsRedToggleButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_jersey_info);

        mNameEditText = (EditText) findViewById(R.id.jersey_info_name_edit_text);
        mNumberEditText = (EditText) findViewById(R.id.jersey_info_number_edit_text);
        mJerseyIsRedToggleButton = (ToggleButton) findViewById(R.id.jersey_info_toggle_color_button);

        mNameEditText.setText(getIntent().getExtras().getString(JerseyDisplayActivity.KEY_PLAYER_NAME));
        mNumberEditText.setText(getIntent().getExtras().getString(JerseyDisplayActivity.KEY_PLAYER_NUMBER));
        mJerseyIsRedToggleButton.setChecked(getIntent().getExtras().getBoolean(JerseyDisplayActivity.KEY_JERSEY_IS_RED));

        ((Button) findViewById(R.id.jersey_info_ok_button)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                int number = 0;
                try {
                    number = Integer.parseInt(mNumberEditText.getText().toString());
                } catch (NumberFormatException e) {
                    Log.e(JerseyDisplayActivity.JDA, "Invalid number format");
                    Toast.makeText(JerseyInfoActivity.this, "Enter a number dude", Toast.LENGTH_LONG).show();
                    return;
                }
                getIntent().putExtra(JerseyDisplayActivity.KEY_PLAYER_NAME, mNameEditText.getText().toString());
                getIntent().putExtra(JerseyDisplayActivity.KEY_PLAYER_NUMBER, "" + number);
                getIntent().putExtra(JerseyDisplayActivity.KEY_JERSEY_IS_RED, mJerseyIsRedToggleButton.isChecked() ? true : false);
                setResult(JerseyDisplayActivity.RESULT_OK, getIntent());
                finish();
            }
        });

        ((Button) findViewById(R.id.jersey_info_cancel_button)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setResult(JerseyDisplayActivity.RESULT_CANCEL);
                finish();
            }
        });
    }


}
