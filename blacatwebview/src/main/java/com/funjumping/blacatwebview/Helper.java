package com.funjumping.blacatwebview;

import java.util.List;
import java.util.Map;

public class Helper {
    public static String ListToString(List<String> list){
        String json = "[";
        for (int i = 0; i < list.size(); i++){
            json += "'" + list.get(i) + "'";
            if (i != list.size() - 1){
                json += ",";
            }
        }
        json += "]";
        return json;
    }

    public static String ListToListToString(List<List<String>> list){
        String json = "[";
        for (int i = 0; i < list.size(); i++){
            json += "'" + ListToString(list.get(i)) + "'";
            if (i != list.size() - 1){
                json += ",";
            }
        }
        json += "]";
        return json;
    }
}
