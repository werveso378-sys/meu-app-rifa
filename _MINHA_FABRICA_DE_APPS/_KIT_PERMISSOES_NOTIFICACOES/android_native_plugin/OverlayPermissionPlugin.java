package com.rifasbabygo.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "OverlayPermission")
public class OverlayPermissionPlugin extends Plugin {

    @PluginMethod
    public void requestOverlayPermission(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.canDrawOverlays(getContext())) {
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:" + getContext().getPackageName()));
                
                getActivity().startActivity(intent);
                
                JSObject ret = new JSObject();
                ret.put("status", "requested");
                call.resolve(ret);
            } else {
                JSObject ret = new JSObject();
                ret.put("status", "granted");
                call.resolve(ret);
            }
        } else {
            JSObject ret = new JSObject();
            ret.put("status", "granted");
            call.resolve(ret);
        }
    }

    @PluginMethod
    public void checkOverlayPermission(PluginCall call) {
        JSObject ret = new JSObject();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            ret.put("granted", Settings.canDrawOverlays(getContext()));
        } else {
            ret.put("granted", true);
        }
        call.resolve(ret);
    }
}
