'use strict';

var NoteIterator = function (song) {
  var count = 0;

  return function () {
    return ++count % song.notes.length;
  };
};

var notesMap = {
  'E' : 329.6,
  'F' : 349.2,
  'G' : 392.0,
  'A' : 440.0,
  'B' : 493.9,
  'C' : 261.6,
  'D' : 293.7,
};

var jingleBells = {
  name: 'Jingle Bells',
  notes: _.map([
    'E','E','E','E','E','E','E','G','C','D','E',
    'F','F','F','F','F','E','E','E','E','E','D','D','E','D',
    'E','E','E','E','E','E','E','G','C','D','E',
    'F','F','F','F','F','E','E','E','E','G','G','F','D','C'
  ], function(n) { return notesMap[n]; })
};

var scale = ['G','A','B','D','E'];

var pentaNotes = [];
for (var i = 0 ; i < 100 ; i++){
    pentaNotes.push(scale[Math.floor(Math.random() * scale.length)]);
}

var pentatonic = {
  name: 'Pentatonic Song',
  notes: _.map(pentaNotes, function(n) { return notesMap[n]; })
};

var Note = function () {
    var pluck = new T('pluck', {freq:pentatonic.notes[noteIterator()], mul:0.5}).bang();
    /* If we want an adsr filter
    var env = T("adsr", {a:200,d:500,s:4.0,r:500}, pluck).on("ended", function() {
    this.pause();
    }).bang();
    var timeout = T("timeout", {timeout:1500}, function() {
        env.release();
        timeout.stop();
    }).start();
    */
    var delay = new T("delay", {time:1250,fb:0.4, mix:.2}, pluck);
    var verb = new T('reverb',{room:0.9, damp:0.9, mix:0.25},delay);
    return verb;
};

var noteIterator = new NoteIterator(jingleBells);

var atlasTrafficServer = '192.168.50.4';
var conn = new WebSocket('ws://' + atlasTrafficServer + ':8765');

conn.onopen = function (ev) {
  console.log(ev);
  return;
};

conn.onmessage = function (ev) {
    var note = new Note();
    note.play();
    console.log(ev);
};
