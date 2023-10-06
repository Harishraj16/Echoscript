document.addEventListener("DOMContentLoaded", function () {
    const audioUploadForm = document.getElementById("audio-upload-form");
    const startRecordingButton = document.getElementById("start-recording");
    const stopRecordingButton = document.getElementById("stop-recording");
    const audioPreview = document.getElementById("audio-preview");
    const feedbackElement = document.getElementById("feedback");

    audioUploadForm.addEventListener("submit", handleAudioUpload);
    startRecordingButton.addEventListener("click", startRecording);
    stopRecordingButton.addEventListener("click", stopRecording);

    let mediaRecorder; // MediaRecorder object for audio recording
    let audioChunks = []; // Array to store recorded audio chunks

    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
                audioPreview.src = URL.createObjectURL(audioBlob);
                audioPreview.play();
                feedbackElement.textContent = "Recording stopped. You can now upload the recorded audio.";
                startRecordingButton.disabled = false;
                stopRecordingButton.disabled = true;
            };

            mediaRecorder.start();
            feedbackElement.textContent = "Recording...";
            startRecordingButton.disabled = true;
            stopRecordingButton.disabled = false;
        } catch (error) {
            console.error("Error starting recording:", error);
        }
    }

    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state === "recording") {
            mediaRecorder.stop();
        }
    }

    // Define the handleAudioUpload function as needed for your project.
    // This function is called when the user submits the audio upload form.
    function handleAudioUpload(event) {
        event.preventDefault();

        const audioFileInput = document.getElementById("audio-file");
        const audioFile = audioFileInput.files[0];

        if (!audioFile) {
            alert("Please select an audio file.");
            return;
        }

        // You can now send the audio file to the backend for processing.
        // You may want to use AJAX (e.g., fetch) to send the file to your Flask backend.
    }
});
