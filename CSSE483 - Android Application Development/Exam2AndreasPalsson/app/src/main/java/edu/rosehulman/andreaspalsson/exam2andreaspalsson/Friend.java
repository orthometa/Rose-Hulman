package edu.rosehulman.andreaspalsson.exam2andreaspalsson;

import android.os.Parcel;
import android.os.Parcelable;

/**
 * Created by palssoa on 1/18/2015.
 */
public class Friend implements Parcelable {

    private String name;
    private Integer hour;
    private Integer minute;

    public Friend(String name, Integer hour, Integer minute) {
        this.name = name;
        this.setHour(hour);
        this.setMinute(minute);
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getHour() {
        return hour;
    }

    public void setHour(Integer hour) {
        this.hour = hour;
    }

    public Integer getMinute() {
        return minute;
    }

    public void setMinute(Integer minute) {
        this.minute = minute;
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(name);
        dest.writeInt(hour);
        dest.writeInt(minute);
    }

    public static final Parcelable.Creator<Friend> CREATOR
            = new Parcelable.Creator<Friend>() {
        public Friend createFromParcel(Parcel in) {
            return new Friend(in);
        }

        public Friend[] newArray(int size) {
            return new Friend[size];
        }
    };

    private Friend(Parcel in) {
        name = in.readString();
        hour = in.readInt();
        minute = in.readInt();
    }
}
