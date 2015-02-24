package edu.rosehulman.andreaspalsson.lightsoutmenuandreaspalsson;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;


public class MainActivity extends ActionBarActivity implements View.OnClickListener {

    public static final int CHANGE_NUM_BUTTONS_REQUEST_CODE = 0;
    public static final int RESULT_OK = 0;

    public static final String KEY_NUM_BUTTONS = "KEY_NUM_BUTTONS";
    public static final String LOM = "LOL";
    private int numButtons = 7;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


    //    SharedPreferences prefs = getSharedPreferences("PREFS", MODE_PRIVATE);
     //   numButtons = prefs.getInt(KEY_NUM_BUTTONS, 7);
        if(savedInstanceState != null)
            numButtons = savedInstanceState.getInt(KEY_NUM_BUTTONS, 7);
        ((Button) findViewById(R.id.play_button)).setOnClickListener(this);
        ((Button) findViewById(R.id.change_num_buttons_button)).setOnClickListener(this);
        ((Button) findViewById(R.id.about_button)).setOnClickListener(this);
        ((Button) findViewById(R.id.exit_button)).setOnClickListener(this);
        ((Button) findViewById(R.id.play_button)).setOnClickListener(this);
        ((Button) findViewById(R.id.play_button)).setText(getString(R.string.play_button_format, numButtons));

    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putInt(KEY_NUM_BUTTONS, numButtons);
    }



    /*  @Override
    protected void onPause() {
        super.onPause();
        SharedPreferences prefs = getSharedPreferences("PREFS", MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putInt(KEY_NUM_BUTTONS, numButtons);
        editor.commit();
    }*/


    @Override
    public void onClick(View view) {
        switch(view.getId()) {
            case R.id.play_button:
                Intent i = new Intent(this, LightsOutActivity.class);
                System.out.println("SENDING NUMBUTTONS: " + numButtons);
                i.putExtra(KEY_NUM_BUTTONS, numButtons);
                startActivity(i);
                break;
            case R.id.change_num_buttons_button:
                Intent i2 = new Intent(this, ChangeNumButtonsActivity.class);
                i2.putExtra(KEY_NUM_BUTTONS, numButtons);

                startActivityForResult(i2, CHANGE_NUM_BUTTONS_REQUEST_CODE);
                break;
            case R.id.about_button:
                startActivity(new Intent(this, AboutActivity.class));
                break;
            case R.id.exit_button:
                Toast.makeText(this, "wat do u want motherfucker", Toast.LENGTH_LONG).show();
                break;
        }
        Log.d("AAA", "clicked a button lol OP");
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        //super.onActivityResult(requestCode, resultCode, data);
 //       if(requestCode != CHANGE_NUM_BUTTONS_REQUEST_CODE)
 //           return;

        //if(resultCode != RESULT_OK)
        //    return;
        Log.d("AAA", "LOL IN ACTIVITY REUSLT");
        numButtons = data.getExtras().getInt(KEY_NUM_BUTTONS);
        Log.d("AAA", "numButtons = : " + numButtons);
        ((Button) findViewById(R.id.play_button)).setText(getString(R.string.play_button_format, numButtons));

    }
}
