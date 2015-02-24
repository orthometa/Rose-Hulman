/*
 * Copyright (C) 2007 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.example.android.snake;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.GestureDetector;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnTouchListener;
import android.widget.TextView;

/**
 * Snake: a simple game that everyone can enjoy.
 * 
 * This is an implementation of the classic Game "Snake", in which you control a serpent roaming
 * around the garden looking for apples. Be careful, though, because when you catch one, not only
 * will you become longer, but you'll move faster. Running into yourself or the walls will end the
 * game.
 * 
 */
public class Snake extends Activity implements GestureDetector.OnGestureListener {

    /**
     * Constants for desired direction of moving the snake
     */
    public static int MOVE_LEFT = 0;
    public static int MOVE_UP = 1;
    public static int MOVE_DOWN = 2;
    public static int MOVE_RIGHT = 3;

    private static String ICICLE_KEY = "snake-view";

    private SnakeView mSnakeView;
    private GestureDetector mDetector;

    /**
     * Called when Activity is first created. Turns off the title bar, sets up the content views,
     * and fires up the SnakeView.
     * 
     */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.snake_layout);

        mSnakeView = (SnakeView) findViewById(R.id.snake);
        mSnakeView.setDependentViews((TextView) findViewById(R.id.text),
                findViewById(R.id.arrowContainer), findViewById(R.id.background));
        mDetector = new GestureDetector(this,this);



        if (savedInstanceState == null) {
            // We were just launched -- set up a new game
            mSnakeView.setMode(SnakeView.READY);
        } else {
            // We are being restored
            Bundle map = savedInstanceState.getBundle(ICICLE_KEY);
            if (map != null) {
                mSnakeView.restoreState(map);
            } else {
                mSnakeView.setMode(SnakeView.PAUSE);
            }
        }
/*
        mSnakeView.setOnTouchListener(new OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
               if (mSnakeView.getGameState() == SnakeView.RUNNING) {
                    // Normalize x,y between 0 and 1
                    float x = event.getX() / v.getWidth();
                    float y = event.getY() / v.getHeight();

                    // Direction will be [0,1,2,3] depending on quadrant
                    int direction = 0;
                    direction = (x > y) ? 1 : 0;
                    direction |= (x > 1 - y) ? 2 : 0;

                    // Direction is same as the quadrant which was clicked
                    mSnakeView.moveSnake(direction);

                } else {
                    // If the game is not running then on touching any part of the screen
                    // we start the game by sending MOVE_UP signal to SnakeView
                    mSnakeView.moveSnake(MOVE_UP);
                }
                return false;
            }
        });*/
    }

    @Override
    protected void onPause() {
        super.onPause();
        // Pause the game along with the activity
        mSnakeView.setMode(SnakeView.PAUSE);
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        // Store the game state
        outState.putBundle(ICICLE_KEY, mSnakeView.saveState());
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main, menu);
        //return super.onPrepareOptionsMenu(menu);
        return true;
    }

    @Override
    public boolean onPrepareOptionsMenu(Menu menu) {
        if (mSnakeView.getMode() == SnakeView.RUNNING)
            this.mSnakeView.setMode(SnakeView.PAUSE);

        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch(item.getItemId()) {
            case R.id.resume:
                if(mSnakeView.getMode() == SnakeView.PAUSE)
                    this.mSnakeView.setMode(SnakeView.RUNNING);
                break;
            case R.id.left:
                if(mSnakeView.getmDirection() == mSnakeView.NORTH)
                    mSnakeView.setNextDirection(mSnakeView.WEST);
                else if(mSnakeView.getmDirection() == mSnakeView.WEST)
                    mSnakeView.setNextDirection(mSnakeView.SOUTH);
                else if(mSnakeView.getmDirection() == mSnakeView.SOUTH)
                    mSnakeView.setNextDirection(mSnakeView.EAST);
                else if(mSnakeView.getmDirection() == mSnakeView.EAST)
                    mSnakeView.setNextDirection(mSnakeView.NORTH);
                break;
            case R.id.right:
                if(mSnakeView.getmDirection() == mSnakeView.NORTH)
                    mSnakeView.setNextDirection(mSnakeView.EAST);
                else if(mSnakeView.getmDirection() == mSnakeView.EAST)
                    mSnakeView.setNextDirection(mSnakeView.SOUTH);
                else if(mSnakeView.getmDirection() == mSnakeView.SOUTH)
                    mSnakeView.setNextDirection(mSnakeView.WEST);
                else if(mSnakeView.getmDirection() == mSnakeView.WEST)
                    mSnakeView.setNextDirection(mSnakeView.NORTH);
                break;
            case R.id.slow:
                mSnakeView.setmMoveDelay(600);
                break;
            case R.id.medium:
                mSnakeView.setmMoveDelay(300);
                break;
            case R.id.fast:
                mSnakeView.setmMoveDelay(100);
                break;
            case R.id.settings:
                Log.d("AAA", "I AM CLICKED SETTINGS ");
        }
        return true;
    }

    /**
     * Handles key events in the game. Update the direction our snake is traveling based on the
     * DPAD.
     *
     */
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent msg) {

        switch (keyCode) {
            case KeyEvent.KEYCODE_DPAD_UP:
                mSnakeView.moveSnake(MOVE_UP);
                break;
            case KeyEvent.KEYCODE_DPAD_RIGHT:
                mSnakeView.moveSnake(MOVE_RIGHT);
                break;
            case KeyEvent.KEYCODE_DPAD_DOWN:
                mSnakeView.moveSnake(MOVE_DOWN);
                break;
            case KeyEvent.KEYCODE_DPAD_LEFT:
                mSnakeView.moveSnake(MOVE_LEFT);
                break;
        }

        return super.onKeyDown(keyCode, msg);
    }

    @Override
    public boolean onDown(MotionEvent e) {
        return false;
    }

    @Override
    public void onShowPress(MotionEvent e) {

    }

    @Override
    public boolean onSingleTapUp(MotionEvent e) {
        return false;
    }

    @Override
    public boolean onScroll(MotionEvent e1, MotionEvent e2, float distanceX, float distanceY) {
        return false;
    }

    @Override
    public void onLongPress(MotionEvent e) {

    }

    @Override
    public boolean onFling(MotionEvent e1, MotionEvent e2, float velocityX,
                           float velocityY) {
        float sensitvity = 50;
        System.out.println("KNARKARE");
        if((e1.getX() - e2.getX()) > sensitvity){
            mSnakeView.moveSnake(0);
        } else if((e2.getX() - e1.getX()) > sensitvity){
            mSnakeView.moveSnake(3);
        } else if((e2.getY() - e1.getY() > sensitvity)) {
            mSnakeView.moveSnake(2);
        } else if((e1.getY() - e2.getY() > sensitvity)) {
            mSnakeView.moveSnake(1);

        }

        return true;
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        mDetector.onTouchEvent(event);
        if (mSnakeView.getGameState() != SnakeView.RUNNING)
            mSnakeView.moveSnake(MOVE_UP);
        return super.onTouchEvent(event);
    }
}
