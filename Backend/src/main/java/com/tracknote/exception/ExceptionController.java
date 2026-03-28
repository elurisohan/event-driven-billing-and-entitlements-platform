package com.tracknote.exception;

import com.stripe.exception.StripeException;
import com.tracknote.model.ErrorCodes;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/*
@ControllerAdvice is a Spring annotation used to define global behavior for controllers.
Think of it as a “catch-all controller helper”. It can do several things:

Handle exceptions thrown by any controller (@ExceptionHandler)
Apply data binding rules globally (@InitBinder)
Add model attributes globally (@ModelAttribute)
 */
@ControllerAdvice
public class ExceptionController {

    @ExceptionHandler(TaskNotFoundException.class)
    public ResponseEntity<?> projectIdNotFound(TaskNotFoundException ex) {
        return ResponseEntity.status(404).body(new ResponseStatus(ErrorCodes.TASK_NOT_FOUND.getCode(), ex.getMessage()));
    }

    @ExceptionHandler(ProjectNotFoundException.class)
    public ResponseEntity<?> projectNotFound(ProjectNotFoundException ex) {
        return ResponseEntity.status(404).body(new ResponseStatus(ErrorCodes.PROJECT_NOT_FOUND.getCode(), ex.getMessage()));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<?> userNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(404).body(new ResponseStatus(ErrorCodes.USER_NOT_FOUND.getCode(), ex.getMessage()));
    }

    @ExceptionHandler(InvalidCredentials.class)
    public ResponseEntity<?> invalidCredentials(InvalidCredentials ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<?> unauthException(UnauthorizedException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
    }

    @ExceptionHandler(ProjectDeletionException.class)
    public ResponseEntity<?> projectDeletionException(ProjectDeletionException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
    }

    @ExceptionHandler(JWTExpiredException.class)
    public ResponseEntity<?> jwtTokenExpired(JWTExpiredException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ResponseStatus(401, ex.getMessage()));
    }

    @ExceptionHandler(PlanNotFoundException.class)
    public ResponseEntity<?> planNotFound(PlanNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(StripeException.class)
    public ResponseEntity<?> stripeException(StripeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(LimitExceededException.class)
    public ResponseEntity<?> limitExceededException(LimitExceededException ex) {
        return ResponseEntity.status(403).body(new ResponseStatus(403, ex.getMessage()));
    }
}

@Data
@AllArgsConstructor
class ResponseStatus {
    private int code;
    private String message;
}
