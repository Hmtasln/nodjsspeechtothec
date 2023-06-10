// Imports the Google Cloud client library

const speech = require('@google-cloud/speech');
const { log } = require('console');


require('dotenv').config();

const fs = require('fs');

const util = require('util');

const client = new speech.SpeechClient();


async function quickstart() {
  // The path to the remote LINEAR16 file stored in Google Cloud Storage
  try {
 
    //const gcsUri = 'gs://hikayesesdosyalari/'+kiztasi;
    const gcsUri = 'gs://hikayesesdosyalari/kiztasi.mp3';

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
      uri: gcsUri,
    };
    const config = {
      encoding: 'MP3',
      sampleRateHertz: 16000,
      languageCode: 'tr-TR',
      enableWordTimeOffsets: true,
    };
    const request = {
      audio: audio,
      config: config,
    };

    // Detects speech in the audio file
    const [operation] = await client.longRunningRecognize(request);
    // Get a Promise representation of the final result of the job
    const [response] = await operation.promise();

    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    //  document.getElementById('hikayemetini').innerHTML=transcription;
    //console.log(`Transcription: ${transcription}`);
    const [responsetime] = await client.recognize(request);
    responsetime.results.forEach((result) => {
      result.alternatives.forEach((alternative) => {
        console.log(`Transcript: ${alternative.transcript}`);
        console.log(`Word details:`);
        console.log(` Word count ${alternative.words.length}`);
        alternative.words.forEach((item) => {
          console.log(`  ${item.word}`);
          const s = parseInt(item.startTime.seconds) +
            item.startTime.nanos / 1000000000;
          console.log(`   WordStartTime: ${s}s`);
          const e = parseInt(item.endTime.seconds) +
            item.endTime.nanos / 1000000000;
          console.log(`   WordEndTime: ${e}s`);
        });
      });
    });

  } catch (error) {
    console.log(error);
  }
}

quickstart();
