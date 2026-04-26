package com.tracknote.exception;

public class LimitExceededException extends RuntimeException {
    public LimitExceededException(int cnt) {
        super(String.format("Limit Exceeded! You currently created '%s' projects ",cnt));
    }

    public LimitExceededException(String message) {
        super(message);
    }
}
