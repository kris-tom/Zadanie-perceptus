package com.perceptus.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class MsgReq {
    
    @NotBlank(message = "Wiadomość nie może być pusta")
    @Size(max = 1000, message = "Za długie")
    private String content;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
