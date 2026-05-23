import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.tracknote.events.SubscriptionCreated;

public class PayloadLen {
  public static void main(String[] args) throws Exception {
    ObjectMapper springLike = new ObjectMapper();
    springLike.registerModule(new JavaTimeModule());
    springLike.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    SubscriptionCreated event = SubscriptionCreated.builder()
        .userId(352).username("doe1").planName("FREE").stripeSubscriptionId(null).build();
    String payload = springLike.writeValueAsString(event);
    System.out.println("len=" + payload.length());
    System.out.println(payload);
  }
}
