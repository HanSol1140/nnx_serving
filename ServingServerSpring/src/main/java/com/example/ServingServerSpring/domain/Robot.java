package com.example.ServingServerSpring.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Robot {
    private String robotName;
    private String robotNumber;
    private String robotIP;
    private Boolean robotRunningState;
    private String robotLastOrderPoint;
}
