package edu.rosehulman.andreaspalsson.lab6fragments;

import android.app.Activity;
import android.app.Fragment;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

/**
 * Created by palssoa on 1/15/2015.
 */
public class FragmentTwo extends Fragment implements View.OnClickListener {

    private OnRandomColorChangeListener mListener;
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_two, container, false);
        v.findViewById(R.id.button).setOnClickListener(this);
        return v;
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        try {
            mListener = (OnRandomColorChangeListener) activity;

        } catch (ClassCastException e) {
            throw new ClassCastException(activity.toString()
                    + " must implement OnRandomColorChangeListener");
        }
    }

    public void setText(String text) {
        ((TextView) getActivity().findViewById(R.id.textView2)).setText(text);
    }

    @Override
    public void onClick(View v) {
        mListener.randomizeColor();
    }
}
