package com.tracknote.exception;


import com.tracknote.model.ErrorCodes;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

@ControllerAdvice
public class ExceptionController {



    @ExceptionHandler(TaskNotFoundException.class)
    public ResponseEntity<?> projectIdNotFound(TaskNotFoundException ex){
        return ResponseEntity.badRequest().body(new ResponseStatus(ErrorCodes.TASK_NOT_FOUND.getCode(), ex.getMessage()) );
    }

    @ExceptionHandler(ProjectNotFoundException.class)
    public ResponseEntity<?> projectNotFound(ProjectNotFoundException ex){
        return ResponseEntity.badRequest().body(new ResponseStatus(ErrorCodes.PROJECT_NOT_FOUND.getCode(), ex.getMessage()));
    }




    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<?> userNotFound(UserNotFoundException ex){
        return ResponseEntity.badRequest().body(new ResponseStatus(ErrorCodes.USER_NOT_FOUND.getCode(), ex.getMessage()));
    }

    @ExceptionHandler(InvalidCredentials.class)
    public ResponseEntity<?> invalidCredentials(InvalidCredentials ex){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
    }

   /* @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,String>> handleValidationErrors(MethodArgumentNotValidException ex){
        Map<String,String> errors=new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error->errors.put(error.getField(),error.getDefaultMessage()));}
        */


    @ExceptionHandler(UnauthorizedException.class)
        public ResponseEntity<?> unauthException(UnauthorizedException ex){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());

    }
    @ExceptionHandler(ProjectDeletionException.class)
    public ResponseEntity<?> projectDeletionException(ProjectDeletionException ex){
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
    }

    @ExceptionHandler(JWTExpiredException.class)
    public ResponseEntity<?> jwtTokenExpired(JWTExpiredException ex){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ResponseStatus(401, ex.getMessage()));
    }
}


@Data
@AllArgsConstructor
class ResponseStatus{
    private int code;
    private String message;
}
