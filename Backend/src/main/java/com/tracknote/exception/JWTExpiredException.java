package com.tracknote.exception;

public class JWTExpiredException extends RuntimeException{
    public JWTExpiredException (){
        super(String.format("JWT token expired"));
    }
}