package net.remoon.salt;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugin(XhePlugin.class);
        super.onCreate(savedInstanceState);
    }
}
