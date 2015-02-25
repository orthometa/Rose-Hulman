package edu.rosehulman.andreaspalsson.finalexampalssoa;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.appspot.csse483_hangman.gameservice.model.Hangman;

import java.util.List;


/**
 * Created by palssoa on 2/24/2015.
 */
public class HangmanAdapter extends ArrayAdapter<Hangman> {

    private Activity context;
    public HangmanAdapter(Context context, int resource, List<Hangman> objects) {
        super(context, resource, objects);
        this.context = (Activity) context;

    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View v = context.getLayoutInflater().inflate(R.layout.row_view, null);
        Hangman hangman = getItem(position);
        ((TextView) v.findViewById(R.id.word)).setText(hangman.getDisplayWord());
        ((TextView) v.findViewById(R.id.guesses)).setText(context.getString(R.string.guesses, hangman.getGuesses()));
        ((TextView) v.findViewById(R.id.created_by)).setText(context.getString(R.string.created_by, hangman.getCreator()));
        int numberOfGuesses = hangman.getGuesses().length();
        int numberOfCorrectGuesses = 0;
        for(int i = 0; i < hangman.getDisplayWord().length(); i++) {
            if(hangman.getDisplayWord().charAt(i) != '*' && hangman.getDisplayWord().charAt(i) != ' ') {
                numberOfCorrectGuesses++;
            }
        }
        ImageView img = (ImageView) v.findViewById(R.id.imageView);
        //number of times the user has been wrong
        int numberOfWrongGuesses = numberOfGuesses - numberOfCorrectGuesses;
        switch(numberOfWrongGuesses) {
            case 0:
                img.setImageResource(R.drawable.hangman0);
                break;
            case 1:
                img.setImageResource(R.drawable.hangman1);
                break;
            case 2:
                img.setImageResource(R.drawable.hangman2);
                break;
            case 3:
                img.setImageResource(R.drawable.hangman3);
                break;
            case 4:
                img.setImageResource(R.drawable.hangman4);
                break;
            case 5:
                img.setImageResource(R.drawable.hangman5);
                break;
            case 6:
                img.setImageResource(R.drawable.hangman6);
                break;
        }
        if(numberOfWrongGuesses >= 6) {
            v.setBackgroundColor(Color.RED);
        }
        boolean won = true;
        for(int i = 0; i < hangman.getDisplayWord().length(); i++) {
            if(hangman.getDisplayWord().charAt(i) == '*') {
                won = false;
                break;
            }
        }
        if(won) {
            v.setBackgroundColor(Color.GREEN);
        }
        return v;
    }
}
