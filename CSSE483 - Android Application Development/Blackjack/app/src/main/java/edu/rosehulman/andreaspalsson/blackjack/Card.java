package edu.rosehulman.andreaspalsson.blackjack;

import java.util.Random;

import android.util.Log;

public class Card {

	public enum Suit {
		CLUBS,
		DIAMONDS,
		HEARTS,
		SPADES
	}
	public enum CardName {
		ACE,
		TWO,
		THREE,
		FOUR,
		FIVE,
		SIX,
		SEVEN,
		EIGHT,
		NINE,
		TEN,
		JACK,
		QUEEN,
		KING
	}
	
	private Suit mSuit;
	private CardName mCardName;
	
	public Card() {
		this(Suit.SPADES, CardName.ACE);
	}
	
	public Card(String cardString) {
		// Format will be "Cardname of Suit"
		String[] cardStringPieces = cardString.split(" ");
		String cardNameString = cardStringPieces[0];
		//String ofString = cardStringPieces[1];
		String suitString = cardStringPieces[2];
		this.mSuit = suitFromString(suitString);
		this.mCardName = cardNameFromString(cardNameString); 
	}

	private CardName cardNameFromString(String cardNameString) {
		if (cardNameString.equalsIgnoreCase("Ace")) {
			return CardName.ACE;
		} else if (cardNameString.equalsIgnoreCase("2")) {
			return CardName.TWO;
		} else if (cardNameString.equalsIgnoreCase("3")) {
			return CardName.THREE;
		} else if (cardNameString.equalsIgnoreCase("4")) {
			return CardName.FOUR;
		} else if (cardNameString.equalsIgnoreCase("5")) {
			return CardName.FIVE;
		} else if (cardNameString.equalsIgnoreCase("6")) {
			return CardName.SIX;
		} else if (cardNameString.equalsIgnoreCase("7")) {
			return CardName.SEVEN;
		} else if (cardNameString.equalsIgnoreCase("8")) {
			return CardName.EIGHT;
		} else if (cardNameString.equalsIgnoreCase("9")) {
			return CardName.NINE;
		} else if (cardNameString.equalsIgnoreCase("Ten")) {
			return CardName.TEN;
		} else if (cardNameString.equalsIgnoreCase("Jack")) {
			return CardName.JACK;
		} else if (cardNameString.equalsIgnoreCase("Queen")) {
			return CardName.QUEEN;
		} else if (cardNameString.equalsIgnoreCase("King")) {
			return CardName.KING;
		} else { 
			return CardName.ACE;
		}
	}
	private Suit suitFromString(String suitString) {
		if (suitString.equalsIgnoreCase("Clubs")) {
			return Suit.CLUBS;
		} else if (suitString.equalsIgnoreCase("Diamonds")) {
			return Suit.DIAMONDS;
		} else if (suitString.equalsIgnoreCase("Hearts")) {
			return Suit.HEARTS;
		} else if (suitString.equalsIgnoreCase("Spades")) {
			return Suit.SPADES;
		} else {
			return Suit.CLUBS;
		}
	}



	public Card(Suit suit, CardName cardName) {
		this.mSuit = suit;
		this.mCardName = cardName;
	}
	
	public int numericValue() {
		return Card.numericValueFromCardName(this.mCardName);
	}

	public Suit getSuit() {
		return mSuit;
	}
	public String getSuitAsString() {
		switch( mSuit ) {
		case CLUBS:
			return "Clubs";
		case DIAMONDS:
			return "Diamonds";
		case HEARTS:
			return "Hearts";
		case SPADES:
			return "Spades";
		default:
			return "";
		}
	}

	public void setSuit(Suit mSuit) {
		this.mSuit = mSuit;
	}

	public CardName getCardName() {
		return mCardName;
	}

	public void setCardName(CardName mCardName) {
		this.mCardName = mCardName;
	}
	public String getCardNameAsString() {
		switch( mCardName ) {
		case ACE:
			return "Ace";
		case TWO:
			return "2";
		case THREE:
			return "3";
		case FOUR:
			return "4";
		case FIVE:
			return "5";
		case SIX:
			return "6";
		case SEVEN:
			return "7";
		case EIGHT:
			return "8";
		case NINE:
			return "9";
		case TEN:
			return "Ten";
		case JACK:
			return "Jack";
		case QUEEN:
			return "Queen";
		case KING:
			return "King";
		default:
			return "";
		}
	}
	private static Random randGenerator = null;
	
	public static Card randomCard() {
		if (Card.randGenerator == null) {
			Card.randGenerator = new Random();
		}
		int suitPick = randGenerator.nextInt(Suit.values().length);
		int cardNamePick = randGenerator.nextInt(CardName.values().length);
		return new Card(Suit.values()[suitPick], CardName.values()[cardNamePick]); 
	}
	public static int numericValueFromCardName(CardName cardName) {
		switch (cardName) {
		case ACE:
			return 1;
		case TWO:
			return 2;
		case THREE:
			return 3;
		case FOUR:
			return 4;
		case FIVE:
			return 5;
		case SIX:
			return 6;
		case SEVEN:
			return 7;
		case EIGHT:
			return 8;
		case NINE:
			return 9;
		case TEN:
		case JACK:
		case QUEEN:
		case KING:
			return 10;
		default:
			return 0;
		}
	}
	@Override
	public String toString() {
		return this.getCardNameAsString() + " of " + this.getSuitAsString();
	}
}
