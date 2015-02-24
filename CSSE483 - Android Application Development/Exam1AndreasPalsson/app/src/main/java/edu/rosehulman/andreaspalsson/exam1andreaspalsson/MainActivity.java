package edu.rosehulman.andreaspalsson.exam1andreaspalsson;

import android.app.ActionBar;
import android.app.Activity;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;


public class MainActivity extends ActionBarActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setTitle("Memory Tool by Andreas Palsson");
        setContentView(R.layout.activity_main);
    }
}
