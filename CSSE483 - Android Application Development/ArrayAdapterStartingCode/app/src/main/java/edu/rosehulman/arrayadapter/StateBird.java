package edu.rosehulman.arrayadapter;

/**
 * Simple class to store the official bird of each U.S. state

 * @author Matt Boutell
 *
 */
class StateBird {
	String mName;
	String mState;

	public StateBird(String name, String state) {
		mName = name;
		mState = state;
	}

	@Override
	public String toString() {
		return mName + " - " + mState;
	}

	public String getName() {
		return mName;
	}

	public String getState() {
		return mState;
	}

}
