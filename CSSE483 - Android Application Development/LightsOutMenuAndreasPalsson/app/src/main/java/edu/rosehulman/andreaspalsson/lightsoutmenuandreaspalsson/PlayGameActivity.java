package edu.rosehulman.andreaspalsson.lightsoutmenuandreaspalsson;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;


public class PlayGameActivity extends Activity {

	private Button[] buttons;
	private TextView textView;
	private LightsOutGame game;
	private int numButtons;
    private LinearLayout layout;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_game);

        numButtons = getIntent().getIntExtra(MainActivity.KEY_NUM_BUTTONS, -1);
        buttons = new Button[numButtons];
        game = new LightsOutGame(buttons.length);
        layout = (LinearLayout) findViewById(R.id.linearLayout);
        LinearLayout.LayoutParams param = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f);
        for(int i = 0; i < buttons.length; i++) {
            Button button = new Button(this);
            button.setLayoutParams(param);
            layout.addView(button);
            buttons[i] = button;
        }

        textView = (TextView) findViewById(R.id.textView);
        
        
        for(int i = 0; i < buttons.length; i++) {
        	buttons[i].setText("" + game.getValueAtIndex(i));
        	buttons[i].setOnClickListener(new OnClickListener() {
				
				@Override
				public void onClick(View v) {
					int buttonIndex = -1;
					for(int i = 0; i < buttons.length; i++) {
						if(v.equals(buttons[i])) {
							buttonIndex = i;
							break;
						}
					}
					
					game.pressedButtonAtIndex(buttonIndex);
					
					for(int i = 0; i < buttons.length; i++) {
						buttons[i].setText("" + game.getValueAtIndex(i));
					}
					if(game.checkForWin()) {
						textView.setText(getString(R.string.you_won));
						for(Button b : buttons) 
							b.setEnabled(false);
					}
				}
			});
        }
        
        ((Button) findViewById(R.id.new_game)).setOnClickListener(new OnClickListener() {
			
			@Override
			public void onClick(View v) {
				textView.setText(getString(R.string.make_the_buttons_match));
				game = new LightsOutGame(buttons.length);
				for(int i = 0; i < buttons.length; i++) {
					buttons[i].setEnabled(true);
					buttons[i].setText("" + game.getValueAtIndex(i));
				}
			}
		});
        
    }


}
