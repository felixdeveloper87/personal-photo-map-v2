package com.personalphotomap.dto;

import java.util.Collections;
import java.util.List;

public class S3UploadResponseDTO {
    private List<String> imageUrls;

    public S3UploadResponseDTO(String fileUrl) {
        this.imageUrls = Collections.singletonList(fileUrl);
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
}
