package edu.rosehulman.andreaspalsson.blackjack;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.ActionBarActivity;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;

public class Blackjack extends Activity {

	public static final String BLACKJACK = "BLACKJACK";
	public static final int DIALOG_ID_MAKE_YOUR_MOVE = 0;
	public static final int DIALOG_ID_SKIP = 1;
	public static final int DIALOG_ID_CHEAT = 2;
	public static final int DIALOG_ID_COACH_COMMENT = 3;
	public static final int DIALOG_ID_ABOUT = 4;

	private static final int[] DRAWABLES_CLUBS = {0,R.drawable.playing_card_club_a,R.drawable.playing_card_club_2,R.drawable.playing_card_club_3,R.drawable.playing_card_club_4,R.drawable.playing_card_club_5,R.drawable.playing_card_club_6,R.drawable.playing_card_club_7,R.drawable.playing_card_club_8,R.drawable.playing_card_club_9,R.drawable.playing_card_club_10,R.drawable.playing_card_club_j,R.drawable.playing_card_club_q,R.drawable.playing_card_club_k};
	private static final int[] DRAWABLES_DIAMONDS = {0,R.drawable.playing_card_diamond_a,R.drawable.playing_card_diamond_2,R.drawable.playing_card_diamond_3,R.drawable.playing_card_diamond_4,R.drawable.playing_card_diamond_5,R.drawable.playing_card_diamond_6,R.drawable.playing_card_diamond_7,R.drawable.playing_card_diamond_8,R.drawable.playing_card_diamond_9,R.drawable.playing_card_diamond_10,R.drawable.playing_card_diamond_j,R.drawable.playing_card_diamond_q,R.drawable.playing_card_diamond_k};
	private static final int[] DRAWABLES_HEARTS = {0,R.drawable.playing_card_heart_a,R.drawable.playing_card_heart_2,R.drawable.playing_card_heart_3,R.drawable.playing_card_heart_4,R.drawable.playing_card_heart_5,R.drawable.playing_card_heart_6,R.drawable.playing_card_heart_7,R.drawable.playing_card_heart_8,R.drawable.playing_card_heart_9,R.drawable.playing_card_heart_10,R.drawable.playing_card_heart_j,R.drawable.playing_card_heart_q,R.drawable.playing_card_heart_k};
	private static final int[] DRAWABLES_SPADES = {0,R.drawable.playing_card_spade_a,R.drawable.playing_card_spade_2,R.drawable.playing_card_spade_3,R.drawable.playing_card_spade_4,R.drawable.playing_card_spade_5,R.drawable.playing_card_spade_6,R.drawable.playing_card_spade_7,R.drawable.playing_card_spade_8,R.drawable.playing_card_spade_9,R.drawable.playing_card_spade_10,R.drawable.playing_card_spade_j,R.drawable.playing_card_spade_q,R.drawable.playing_card_spade_k};
	private ImageView mDealerCardImageView;
	private ImageView mPlayerCardImageView_1;
	private ImageView mPlayerCardImageView_2;

	private BlackjackRound mRound;
	private String mActionSelected;
	private static final String KEY_DEALER_CARD = "KEY_DEALER_CARD";
	private static final String KEY_PLAYER_CARD_1 = "KEY_PLAYER_CARD_1";
	private static final String KEY_PLAYER_CARD_2 = "KEY_PLAYER_CARD_2";
	private static final String KEY_NUM_CORRECT = "KEY_NUM_CORRECT";
	private static final String KEY_NUM_ROUNDS = "KEY_NUM_ROUNDS";
	private static final String KEY_ACTION_SELECTED = "KEY_ACTION_SELECTED";
	private int mNumCorrect;
	private int mNumRounds;

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);
		
		this.mDealerCardImageView = (ImageView) findViewById(R.id.dealer_card_1);
		this.mPlayerCardImageView_1 = (ImageView) findViewById(R.id.player_card_1);
		this.mPlayerCardImageView_2 = (ImageView) findViewById(R.id.player_card_2);

		((Button) findViewById(R.id.make_your_move_button)).setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				AlertDialog.Builder builder = new AlertDialog.Builder(Blackjack.this);
                builder.setTitle(R.string.make_your_move_title);
                builder.setItems(mRound.legalMovesAsString(), new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        AlertDialog.Builder builder = new AlertDialog.Builder(Blackjack.this);
                        mActionSelected = mRound.legalMovesAsString()[which];
                        mNumRounds++;
                        if(mActionSelected.equals(mRound.getCorrectPlayerActionAsString())) {
                            mNumCorrect++;
                            builder.setTitle(R.string.correct);
                            builder.setIcon(R.drawable.correct_move);
                            builder.setMessage(getString(R.string.percentage_correct, mNumCorrect, mNumRounds, (double) mNumCorrect/mNumRounds*100.0));
                        } else {
                            builder.setTitle(R.string.incorrect);
                            builder.setIcon(R.drawable.incorrect_move);
                            builder.setMessage(getString(R.string.coach_advice, mRound.toString(), mRound.getCorrectPlayerActionAsString()) +
                                    getString(R.string.percentage_correct, mNumCorrect, mNumRounds, (double) mNumCorrect/mNumRounds*100.0));
                        }
                        builder.setNeutralButton(android.R.string.ok, new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                dialog.dismiss();
                                initNewRound();
                            }
                        });
                        builder.create().show();                    }
                });
                builder.create().show();
			}
		});
		((Button) findViewById(R.id.skip_button)).setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
                AlertDialog.Builder builder = new AlertDialog.Builder(Blackjack.this);
                builder.setTitle(R.string.skip);
                builder.setMessage(R.string.skip_message);
                builder.setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        initNewRound();
                    }
                });
                builder.setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                    }
                });
                builder.create().show();
			}
		});
		((Button) findViewById(R.id.cheat_button)).setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				//AlertDialog.Builder builder = new AlertDialog.Builder(Blackjack.this);
                DialogFragment df = new DialogFragment() {

                    @Override
                    public Dialog onCreateDialog(Bundle savedInstanceState) {
                        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
                        builder.setView(getLayoutInflater().inflate(R.layout.dialog_cheat, null));
                        builder.setTitle(getString(R.string.coach_advice, mRound.toString(), mRound.getCorrectPlayerActionAsString()));
                        return builder.create();
                    }
                };
                df.show(getFragmentManager(), "cheat");
			}
		});

		SharedPreferences prefs = getPreferences(MODE_PRIVATE);
		this.mNumCorrect = prefs.getInt(KEY_NUM_CORRECT, 0);
		this.mNumRounds = prefs.getInt(KEY_NUM_ROUNDS, 0);
		String dealerCardString = prefs.getString(KEY_DEALER_CARD, "");
		String playerCardString1 = prefs.getString(KEY_PLAYER_CARD_1, "");
		String playerCardString2 = prefs.getString(KEY_PLAYER_CARD_2, "");
		if (dealerCardString.equalsIgnoreCase("") || playerCardString1.equalsIgnoreCase("") || playerCardString2.equalsIgnoreCase("")) {
			initNewRound();
		} else {
			Card dealerCard = new Card(dealerCardString);
			Card playerCard1 = new Card(playerCardString1);
			Card playerCard2 = new Card(playerCardString2);
			this.mRound = new BlackjackRound(this, dealerCard, playerCard1, playerCard2);
			updateView();
			this.mActionSelected = prefs.getString(KEY_ACTION_SELECTED, "");  // Fixing a bug when the coach dialog is open during a rotate
		}
	}

	private void initNewRound() {
		Blackjack.this.mRound = new BlackjackRound(this);
		updateView();	
	}

	private void updateView() {
		Card.CardName dealerCardName = this.mRound.getDealerCard().getCardName();
		Card.Suit dealerSuit = this.mRound.getDealerCard().getSuit();
		Card.CardName playerCardName1 = this.mRound.getPlayerCard1().getCardName();
		Card.Suit playerSuit1 = this.mRound.getPlayerCard1().getSuit();
		Card.CardName playerCardName2 = this.mRound.getPlayerCard2().getCardName();
		Card.Suit playerSuit2 = this.mRound.getPlayerCard2().getSuit();

		int dealerCardDrawableIndex = getDrawableIndexFromCardName( dealerCardName );
		int playerCardDrawableIndex1 = getDrawableIndexFromCardName( playerCardName1 );
		int playerCardDrawableIndex2 = getDrawableIndexFromCardName( playerCardName2 );

		int[] dealerDrawableArray = getDrawableArrayFromSuit( dealerSuit );
		int[] playerDrawableArray1 = getDrawableArrayFromSuit( playerSuit1 );
		int[] playerDrawableArray2 = getDrawableArrayFromSuit( playerSuit2 );

		this.mDealerCardImageView.setImageResource(dealerDrawableArray[dealerCardDrawableIndex]);
		this.mPlayerCardImageView_1.setImageResource(playerDrawableArray1[playerCardDrawableIndex1]);
		this.mPlayerCardImageView_2.setImageResource(playerDrawableArray2[playerCardDrawableIndex2]);
	}

	private int[] getDrawableArrayFromSuit(Card.Suit dealerSuit) {
		switch (dealerSuit) {
		case CLUBS:
			return DRAWABLES_CLUBS;
		case DIAMONDS:
			return DRAWABLES_DIAMONDS;
		case HEARTS:
			return DRAWABLES_HEARTS;
		case SPADES:
			return DRAWABLES_SPADES;
		default:
			return null;
		}
	}

	private int getDrawableIndexFromCardName(Card.CardName cardName) {
		switch (cardName) {
		case KING:
			return 13;
		case QUEEN:
			return 12;
		case JACK:
			return 11;
		default:
			return Card.numericValueFromCardName(cardName);
		}
	}

	@Override
	protected void onPause() {
		super.onPause();
		SharedPreferences prefs = getPreferences(MODE_PRIVATE);
		SharedPreferences.Editor editor = prefs.edit();
		editor.putInt(KEY_NUM_CORRECT, this.mNumCorrect);
		editor.putInt(KEY_NUM_ROUNDS, this.mNumRounds);
		editor.putString(KEY_DEALER_CARD, this.mRound.getDealerCard().toString());
		editor.putString(KEY_PLAYER_CARD_1, this.mRound.getPlayerCard1().toString());
		editor.putString(KEY_PLAYER_CARD_2, this.mRound.getPlayerCard2().toString());
		editor.putString(KEY_ACTION_SELECTED, this.mActionSelected);
		editor.commit();
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		super.onCreateOptionsMenu(menu);
		MenuInflater inflater = getMenuInflater();
		inflater.inflate(R.menu.options_menu, menu);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		switch (item.getItemId()) {
		case R.id.about_menu_item:
			showAboutDialog();
			return true;
		case R.id.reset_menu_item:
			this.mNumCorrect = 0;
			this.mNumRounds = 0;
			return true;
		default:
			return super.onOptionsItemSelected(item);	
		}
	}

    private void showAboutDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setIcon(R.drawable.ic_blackjack);
        builder.setTitle(R.string.about_title);
        builder.setMessage(R.string.about_message);
        builder.setNeutralButton(android.R.string.ok, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
            }
        });
        builder.create().show();
    }
}