package edu.rosehulman.arrayadapter;

import java.util.ArrayList;

import android.app.Activity;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.ListView;

public class MainActivity extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		// Add some birds
		ArrayList<StateBird> birds = new ArrayList<StateBird>();
		birds.add(new StateBird("Cardinal", "Indiana"));
		birds.add(new StateBird("Willow Goldfinch", "Washington"));
		birds.add(new StateBird("Valley Quail", "California"));
		birds.add(new StateBird("Cardinal", "Illinois"));
		birds.add(new StateBird("American Robin", "Michigan"));
		birds.add(new StateBird("Chickadee", "Massachusetts"));

        BirdAdapter adapter = new BirdAdapter(this, birds);
        ListView listView = (ListView) findViewById(R.id.list_view);
        listView.setAdapter(adapter);
	}
}
