var app = angular.module('HtotheIpsum', []);

lyrics = [];

// Set number of songs
var songCount = 2;

var clean = {
  'asshole': 'a••hole',
  'beat off': 'b••• off',
  'bitch': 'b••••',
  'blow job': 'b••• job',
  'blowjob': 'b•••job',
  'bullshit': 'bulls•••',
  'bust a nut': 'bust a n••',
  'carpet muncher': 'c••••• m••••••',
  'chink': 'c•••••',
  'clit': 'c••t',
  'cock': 'c••k',
  'coochie': 'c••••••',
  'cum': 'c••',
  'cunt': 'cu••',
  'dago': 'd••o',
  'damn': 'd••n',
  'dick': 'd••k',
  'dirty sanchez': 'dirty s••••••',
  'dyke': 'd••e',
  'fag': 'f•g',
  'fuck': 'f•••',
  'goddamn': 'g••••••',
  'gook': 'g••k',
  'hand job': 'h••• job',
  'handjob': 'h•••job',
  'jack off': 'j••• off',
  'jackoff': 'j•••off',
  'jerk off': 'j••• off',
  'jerkoff': 'j•••off',
  'jizz': 'j•••',
  'kike': 'k•••',
  'mofo': 'm•••',
  'nigga': 'n••••',
  'nigger': 'n•••••',
  'prick': 'p•••k',
  'pussy': 'p•••y',
  'shit': 's••t',
  'spic': 's••c',
  'skeet': 's••••',
  'tit': 't••',
  'twat': 't•••',
  'wetback': 'w••••••',
  'whack off': 'w•••• off',
  'whackoff': 'w••••off'
}

var dirty = {
  'a••hole': 'asshole',
  'b••• off': 'beat off',
  'b••••': 'bitch',
  'b••• job': 'blow job',
  'b•••job': 'blowjob',
  'bulls•••': 'bullshit',
  'bust a n••': 'bust a nut',
  'c••••• m••••••': 'carpet muncher',
  'c•••••': 'chink',
  'c••t': 'clit',
  'c••k': 'cock',
  'c••••••': 'coochie',
  'c••': 'cum',
  'cu••': 'cunt',
  'd••o': 'dago',
  'd••n': 'damn',
  'd••k': 'dick',
  'dirty s••••••': 'dirty sanchez',
  'd••e': 'dyke',
  'f•g': 'fag',
  'f•••': 'fuck',
  'g••••••': 'goddamn',
  'g••k': 'gook',
  'h••• job': 'hand job',
  'h•••job': 'handjob',
  'ja•• off': 'jack off',
  'ja••off': 'jackoff',
  'je•• off': 'jerk off',
  'je••off': 'jerkoff',
  'j•••': 'jizz',
  'k•••': 'kike',
  'm•••': 'mofo',
  'n••••': 'nigga',
  'n•••••': 'nigger',
  'p•••k': 'prick',
  'p•••y': 'pussy',
  's••t': 'shit',
  's••c': 'spic',
  's••••': 'skeet',
  't••': 'tit',
  't•••': 'twat',
  'w••••••': 'wetback',
  'w•••• off': 'whack off',
  'w••••off': 'whackoff'
}

// Curse word regex
var reClean = new RegExp(Object.keys(clean).join('|'), 'gi');
var reDirty = new RegExp(Object.keys(dirty).join('|'), 'gi');

// Hide copy button if it’s not supported
var copySupport = document.queryCommandSupported('copy');
try {
  document.queryCommandEnabled('copy');
} catch(e) {
  copySupport = false;
}

if(!copySupport) {
  var result = document.querySelector('.result');
  var copyBtn = document.querySelector('.result_btn');
  copyBtn.setAttribute('disabled', true);
  result.removeChild(copyBtn);
}

// Ipsum Controller
app.controller('ipsumController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
  $scope.clean = false;
  $scope.length = 1;
  $scope.unit = 'paragraph';
  $scope.caps = 'sentence';

  var maxCount = 5;

  $scope.clean = true;

  $scope.getIpsum = function(){
    lyrics = [];

    $http.get('/assets/json/ipsum.json').success(function(response){
      var songArr = Object.keys(response);
      songArr = shuffle(songArr);
      var song = songArr[0];
      song = response[song];

      // Get the amount of text requested
      var pArr = Object.keys(song);
      pArr = shuffle(pArr);

      if($scope.unit == 'paragraph') {
        for(i = 0; i < $scope.length; i++) {
          var p = pArr[i];
          lyrics.push(song[p]);
        }

        censor($scope.clean, $scope.unit);

        $scope.text = lyrics;
      } else {
        var rand = Math.floor(Math.random() * maxCount);
        var p = pArr[rand];
        song[p] = song[p].replace(',', '').replace('.', '').replace('?', '').replace('!', '').replace('“', '').replace('”', '');
        lyrics = song[p].split(/\s+/).slice(rand, (rand + parseFloat($scope.length)));

        censor($scope.clean, $scope.unit);

        $scope.text = lyrics;
      }

      $scope.plainText = plainText(lyrics, $scope.unit);
    });
  };

  $scope.copyIpsum = function(e) {
    var copyText = document.querySelector('.result_copy');
    copyText.select();
    document.execCommand('copy');
    copyText.blur();
    e.target.className += ' btn-success';
    $timeout(function(){
      e.target.innerHTML = 'Copy Text';
      e.target.classList.toggle('btn-success');
    }, 2000);
  }

  $scope.censorIpsum = function() {
    censor($scope.clean, $scope.unit);
    $scope.text = lyrics;
    $scope.plainText = plainText(lyrics);
  };

  // Run getIpsum() on load
  $scope.getIpsum();
}]);

// Function to shuffle text
function shuffle(a) {
  var j, x, i;
  for(i = a.length; i; i -= 1) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
  return a;
}

// Function to censor/uncensor text
function censor(censor, unit) {
  if(lyrics.length) {
    if(censor) {
      for(i = 0; i < lyrics.length; i++) {
        lyrics[i] = lyrics[i].replace(reClean, function(matched){
          return clean[matched.toLowerCase()];
        });
      }
    } else {
      for(i = 0; i < lyrics.length; i++) {
        lyrics[i] = lyrics[i].replace(reDirty, function(matched){
          return dirty[matched.toLowerCase()];
        });
      }
    }
  }

  plainText(lyrics, unit);
}

// Function to get lyrics as plain text
function plainText(lyrics, unit) {
  var plainText = '';

  for(i = 0; i < lyrics.length; i++) {
    if(i != 0 && unit == 'paragraph') {
      plainText += '\n\n'
    } else if(i != 0) {
      plainText += ' '
    }
    plainText += lyrics[i];
  }

  return plainText;
}
