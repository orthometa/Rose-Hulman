package edu.rosehulman.andreaspalsson.lab6fragments;


import android.app.Activity;
import android.app.FragmentTransaction;
import android.os.Bundle;


public class MainActivity extends Activity implements OnDataPassToTwoListener, OnRandomColorChangeListener {

    FragmentOne fragmentOne;
    FragmentTwo fragmentTwo;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        fragmentOne = new FragmentOne();
        fragmentTwo = new FragmentTwo();

        FragmentTransaction ft = getFragmentManager().beginTransaction();
        ft.add(R.id.fragment_one_container, fragmentOne);
        ft.add(R.id.fragment_two_container, fragmentTwo);
        ft.commit();

    }

    @Override
    public void passDataToTwo(String data) {
        fragmentTwo.setText(data);
    }

    @Override
    public void randomizeColor() {
        fragmentOne.setRandomBackground();
    }
}
