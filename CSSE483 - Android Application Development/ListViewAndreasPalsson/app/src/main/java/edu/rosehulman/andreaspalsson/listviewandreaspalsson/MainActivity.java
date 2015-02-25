package edu.rosehulman.andreaspalsson.listviewandreaspalsson;

import android.app.Activity;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;
import android.widget.Toast;

import java.util.ArrayList;


public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        final ListView listView = (ListView) findViewById(R.id.list_view);
        final Button addViewButton = (Button) findViewById(R.id.add_view_button);

        ArrayList<String> names = new ArrayList<String>();
        names.add("Nick");
        names.add("Knarckare 2");
        names.add("Ingen");
        names.add("Lol ingen alls");

        final RowNumberAdapter adapter = new RowNumberAdapter(this);
        listView.setAdapter(adapter);

        addViewButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                adapter.addView();
                adapter.notifyDataSetChanged();
            }
        });

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {

            @Override
            public void onItemClick(AdapterView<?> parent, View view,
                                    int position, long id) {
                Toast.makeText(MainActivity.this,
                        "You pressed row " + adapter.getItem(position),
                        Toast.LENGTH_LONG).show();
            }
        });
    }


}
