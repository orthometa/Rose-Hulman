package edu.rosehulman.andreaspalsson.lightsoutmenuandreaspalsson;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.RadioButton;

/**
 * Created by palssoa on 12/11/2014.
 */
public class ChangeNumButtonsActivity extends Activity implements View.OnClickListener{

    private int numButtons = -1;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_change_num_buttons);
        numButtons = getIntent().getIntExtra(MainActivity.KEY_NUM_BUTTONS, -1);
        System.out.println("NUMBUTOTNS: " + numButtons);
        switch(numButtons) {
            case 3:
                ((RadioButton)findViewById(R.id.radio3)).setChecked(true);

                break;
            case 5:
                ((RadioButton)findViewById(R.id.radio5)).setChecked(true);
                break;
            case 7:
                ((RadioButton)findViewById(R.id.radio7)).setChecked(true);
                break;
            case 9:
                ((RadioButton)findViewById(R.id.radio9)).setChecked(true);
                break;
        }

        ((RadioButton)findViewById(R.id.radio3)).setOnClickListener(this);
        ((RadioButton)findViewById(R.id.radio5)).setOnClickListener(this);
        ((RadioButton)findViewById(R.id.radio7)).setOnClickListener(this);
        ((RadioButton)findViewById(R.id.radio9)).setOnClickListener(this);


    }

    @Override
    public void onClick(View view) {
        Intent returnIntent = new Intent();
        switch(view.getId()) {
            case R.id.radio3:
                returnIntent.putExtra(MainActivity.KEY_NUM_BUTTONS, 3);

                break;
            case R.id.radio5:
                returnIntent.putExtra(MainActivity.KEY_NUM_BUTTONS, 5);
                break;
            case R.id.radio7:
                returnIntent.putExtra(MainActivity.KEY_NUM_BUTTONS, 7);
                break;
            case R.id.radio9:
                returnIntent.putExtra(MainActivity.KEY_NUM_BUTTONS, 9);
                break;
        }

        setResult(MainActivity.RESULT_OK, returnIntent);
        finish();
    }
}
