package edu.rosehulman.andreaspalsson.lab6fragments;

import android.app.Activity;
import android.app.Fragment;
import android.graphics.Color;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import java.util.Random;

/**
 * Created by palssoa on 1/15/2015.
 */
public class FragmentOne extends Fragment implements View.OnClickListener {

    private OnDataPassToTwoListener mListener;

    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_one, container, false);
        v.findViewById(R.id.button).setOnClickListener(this);
        return v;
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        try {
            mListener = (OnDataPassToTwoListener) activity;
        } catch (ClassCastException e) {
            throw new ClassCastException(activity.toString()
                    + " must implement OnDataPassToTwoListener");
        }
    }

    @Override
    public void onClick(View v) {
        if(((TextView) getActivity().findViewById(R.id.textView2)).getText().toString().equals(getString(R.string.two)))
            mListener.passDataToTwo(getString(R.string.one));
        else
            mListener.passDataToTwo(getString(R.string.two));
    }

    public void setRandomBackground() {
        Random rand = new Random();
        getView().setBackgroundColor(Color.rgb(rand.nextInt(255), rand.nextInt(255), rand.nextInt(255)));
    }
}
