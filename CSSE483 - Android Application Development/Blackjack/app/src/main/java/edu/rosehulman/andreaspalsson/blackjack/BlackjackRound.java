package edu.rosehulman.andreaspalsson.blackjack;

import android.content.Context;
import android.content.res.Resources;

public class BlackjackRound {
	
	public enum PlayerAction {
		HIT,
		STAND,
		DOUBLE_DOWN,
		SPLIT
	}
	private Context mContext;
	private Card mDealerCard;
	private Card mPlayerCard1;
	private Card mPlayerCard2;
	private PlayerAction mCorrectPlayerAction;
	
	public BlackjackRound(Context context) {
		this(context, Card.randomCard(), Card.randomCard(), Card.randomCard());
	}
	
	public BlackjackRound(Context context, Card dealerCard, Card playerCard1, Card playerCard2) {
		this.mContext = context;
		this.mDealerCard = dealerCard;
		this.mPlayerCard1 = playerCard1;
		this.mPlayerCard2 = playerCard2;
		
		// Figure out the correct move
		this.mCorrectPlayerAction = determineCorrectAction();
	}

	private PlayerAction determineCorrectAction() {
		if (this.mPlayerCard1.numericValue() == this.mPlayerCard2.numericValue()) {
			// Evaluate split matrix	
			return determineCorrectActionSplit();
		} else if (this.mPlayerCard1.getCardName() == Card.CardName.ACE || this.mPlayerCard2.getCardName() == Card.CardName.ACE) {
			// Evaluate soft total matrix	
			return determineCorrectActionSoftTotal();
		} else {
			// Evaluate hard total matrix
			return determineCorrectActionHardTotal();
		}
	}

	private PlayerAction determineCorrectActionHardTotal() {
		int hardTotal = this.mPlayerCard1.numericValue() + this.mPlayerCard2.numericValue();
		int dealerCardValue = this.mDealerCard.numericValue();
		if (hardTotal <= 8) {
			return PlayerAction.HIT;
		} else if (hardTotal == 9) {
			if (dealerCardValue >= 3 && dealerCardValue <= 6)
				return PlayerAction.DOUBLE_DOWN;
			else
				return PlayerAction.HIT;
		} else if (hardTotal == 10) {
			if (dealerCardValue >= 2 && dealerCardValue <= 9)
				return PlayerAction.DOUBLE_DOWN;
			else
				return PlayerAction.HIT;
		} else if (hardTotal == 11) {
			return PlayerAction.DOUBLE_DOWN;
		} else if (hardTotal == 12) {
			if (dealerCardValue >= 4 && dealerCardValue <= 6)
				return PlayerAction.STAND;
			else
				return PlayerAction.HIT;
		} else if (hardTotal > 12 && hardTotal < 17) {
			if (dealerCardValue >= 2 && dealerCardValue <= 6)
				return PlayerAction.STAND;
			else
				return PlayerAction.HIT;
		} else {
			return PlayerAction.STAND;  // 17, 18, 19 (20 and 21 would be in other categories)
		}
	}

	private PlayerAction determineCorrectActionSoftTotal() {
		int nonAceNumericValue = this.mPlayerCard1.numericValue();
		if (this.mPlayerCard1.getCardName() == Card.CardName.ACE) {
			nonAceNumericValue = this.mPlayerCard2.numericValue();
		}
		int dealerCardValue = this.mDealerCard.numericValue();
		switch( nonAceNumericValue ) {
		case 2:
		case 3:
			if (dealerCardValue >= 5 && dealerCardValue <= 6)
				return PlayerAction.DOUBLE_DOWN;
			else
				return PlayerAction.HIT;
		case 4:
		case 5:
			if (dealerCardValue >= 4 && dealerCardValue <= 6)
				return PlayerAction.DOUBLE_DOWN;
			else
				return PlayerAction.HIT;
		case 6:
			if (dealerCardValue >= 3 && dealerCardValue <= 6)
				return PlayerAction.DOUBLE_DOWN;
			else
				return PlayerAction.HIT;
		case 7:
			if (dealerCardValue >= 3 && dealerCardValue <= 6)
				return PlayerAction.DOUBLE_DOWN;
			else if (dealerCardValue == 2 || dealerCardValue == 7 || dealerCardValue == 8)
				return PlayerAction.STAND;
			else
				return PlayerAction.HIT;
		default:
			return PlayerAction.STAND;  // 8, 9, 10 (Note: 10 is a Blackjack)
		}
	}

	private PlayerAction determineCorrectActionSplit() {
		switch (this.mPlayerCard1.getCardName()) {
		case ACE:
		case EIGHT:
			return PlayerAction.SPLIT;
		case TEN:
		case JACK:
		case QUEEN:
		case KING:
			return PlayerAction.STAND;
		case FOUR:
			return PlayerAction.HIT;
		case TWO:
		case THREE:
			// 4,5,6,7 - Split
			if (this.mDealerCard.numericValue() >= 4 && this.mDealerCard.numericValue() <= 7)
				return PlayerAction.SPLIT;
			else
				return PlayerAction.HIT;
		case FIVE:
			if (this.mDealerCard.numericValue() == 10 || this.mDealerCard.getCardName() == Card.CardName.ACE)
				return PlayerAction.HIT;
			else
				return PlayerAction.DOUBLE_DOWN;
		case SIX:
			// 3,4,5,6 - Split
			if (this.mDealerCard.numericValue() >= 3 && this.mDealerCard.numericValue() <= 6)
				return PlayerAction.SPLIT;
			else
				return PlayerAction.HIT;
		case SEVEN:
			// 2,3,4,5,6,7 - Split
			if (this.mDealerCard.numericValue() >= 2 && this.mDealerCard.numericValue() <= 7)
				return PlayerAction.SPLIT;
			else
				return PlayerAction.HIT;
		case NINE:
			// 2,3,4,5,6,  8,9 - Split
			if ((this.mDealerCard.numericValue() >= 2 && this.mDealerCard.numericValue() <= 6) || this.mDealerCard.numericValue() == 8 || this.mDealerCard.numericValue() == 9)
				return PlayerAction.SPLIT;
			else
				return PlayerAction.STAND;
		default:
			return PlayerAction.HIT;  // Should not happen
		}
	}

	public PlayerAction[] legalMoves() {
		if (this.mPlayerCard1.numericValue() == this.mPlayerCard2.numericValue()) {
			if (this.mPlayerCard1.getCardName() == Card.CardName.ACE) {
				// Split is the only legal action
				return new PlayerAction[] {PlayerAction.SPLIT};
			} else {
				// All actions legal
				return new PlayerAction[] {PlayerAction.HIT, PlayerAction.STAND, PlayerAction.DOUBLE_DOWN, PlayerAction.SPLIT};
			}
		} else {
			// Cannot split.  Check for blackjack
			if ((this.mPlayerCard1.getCardName() == Card.CardName.ACE && this.mPlayerCard2.numericValue() == 10) || (this.mPlayerCard2.getCardName() == Card.CardName.ACE && this.mPlayerCard1.numericValue() == 10)) {
				// Stand is the only legal action
				return new PlayerAction[] {PlayerAction.STAND};
			} else {
				// Everything but split is legal
				return new PlayerAction[] {PlayerAction.HIT, PlayerAction.STAND, PlayerAction.DOUBLE_DOWN};
			}
		}
	}
	
	public String[] legalMovesAsString() {
		Resources res = this.mContext.getResources();
		if (this.mPlayerCard1.numericValue() == this.mPlayerCard2.numericValue()) {
			if (this.mPlayerCard1.getCardName() == Card.CardName.ACE) {
				return new String[] {res.getString(R.string.split)};  // Split is the only legal action
			} else {
				return new String[] {res.getString(R.string.hit), res.getString(R.string.stand), res.getString(R.string.double_down), res.getString(R.string.split)};  // All actions legal
			}
		} else {
			// Cannot split.  Check for blackjack
			if ((this.mPlayerCard1.getCardName() == Card.CardName.ACE && this.mPlayerCard2.numericValue() == 10) || (this.mPlayerCard2.getCardName() == Card.CardName.ACE && this.mPlayerCard1.numericValue() == 10)) { 
				return new String[] {res.getString(R.string.stand)};  // Blackjack!  Stand is the only legal action
			} else {
				return new String[] {res.getString(R.string.hit), res.getString(R.string.stand), res.getString(R.string.double_down)};  // Everything but split is legal
			}
		}
	}
	
	public Card getDealerCard() {
		return mDealerCard;
	}

	public Card getPlayerCard1() {
		return mPlayerCard1;
	}

	public Card getPlayerCard2() {
		return mPlayerCard2;
	}

	public PlayerAction getCorrectPlayerAction() {
		return mCorrectPlayerAction;
	}
	public String getCorrectPlayerActionAsString() {
		Resources res = this.mContext.getResources();
		switch(mCorrectPlayerAction) {
		case HIT:
			return res.getString(R.string.hit);
		case STAND:
			return res.getString(R.string.stand);
		case DOUBLE_DOWN:
			return res.getString(R.string.double_down);
		case SPLIT:
			return res.getString(R.string.split);
		default:
			return res.getString(R.string.unknown_action);
		}
	}
	@Override
	public String toString() {
		Resources res = this.mContext.getResources();
		String dealerCardName = this.mDealerCard.getCardNameAsString();
		String playerCardName1 = this.mPlayerCard1.getCardNameAsString();
		String playerCardName2 = this.mPlayerCard2.getCardNameAsString();
		if (this.mPlayerCard2.getCardName() == Card.CardName.ACE) {
			return res.getString(R.string.round_to_string, playerCardName2, playerCardName1, dealerCardName);
		}
		return res.getString(R.string.round_to_string, playerCardName1, playerCardName2, dealerCardName);
	}
}
