/**
 * Created by Petr Marek on 21.7.2015.
 */

var BASE_URL = 'https://docs.google.com/forms/d/1Vra6SgNnso6Nn45adZNd0mVWtTMe5_W4QABhlYxfP8I/formResponse?';
var FIELDS_IDS = ["entry.557679011", "entry.668964305", "entry.315539511", "entry.807998585", "entry.1331990072",
    "entry.540581579", "entry.799866241", "entry.1492550795", "entry.1983407746"];
var SUBMIT_REF = '&submit=Submit';

var CORRECT_A = true;
var INCORRECT_A = false;


var correctAnswerFieldNumber = 1;

var feedbackButtons;

//click on submit button
$(document).on('click', '#form-submit', function () {
    var email = $('#email').val();
    if (supports_html5_storage()) {
        localStorage.setItem("email", email);
    }
    sendAndReload(email);

});

//click on more correct button
$(document).on('click', '#moreCorrectAnswers', function () {
    var toAppend = $('<label for="ea' + (correctAnswerFieldNumber + 1) + '" id="eaLabel' + (correctAnswerFieldNumber + 1) + '">Correct answer:</label><input id="ea' +
        (correctAnswerFieldNumber + 1) + '" placeholder="Correct answer" name="ea' + (correctAnswerFieldNumber + 1) + '">');
    $("#ea" + correctAnswerFieldNumber).parent().after(toAppend);
    $('#ea' + (correctAnswerFieldNumber + 1)).textinput();
    /*$("#ea"+correctAnswerFieldNumber).parent().css("width","104%");
     $("#ea"+correctAnswerFieldNumber).parent().css("position","relative");
     $("#ea"+correctAnswerFieldNumber).parent().css("left","165px");
     $("#ea"+correctAnswerFieldNumber).parent().css("top",(-28*correctAnswerFieldNumber)+"px");
     $("#ea"+(correctAnswerFieldNumber+1)).parent().css("position","relative");
     $("#ea"+(correctAnswerFieldNumber+1)).parent().css("top",(-28*correctAnswerFieldNumber)+"px");
     $("#eaLabel"+(correctAnswerFieldNumber+1)).css("position","relative");
     $("#eaLabel"+(correctAnswerFieldNumber+1)).css("top",(-28*correctAnswerFieldNumber)+"px");*/
    $("#moreCorrectAnswerContainer").css("position", "relative");
    $("#moreCorrectAnswerContainer").css("top", 5 + 37 * correctAnswerFieldNumber);
    correctAnswerFieldNumber++;
});

//send if answer was correct
function sendAndReload(email) {
    var question = $('#search').val();
    var ea = getCorrectAnswers();
    ea = addFeedbackFromInputFields(ea);
    if (ea[0] != "") {
        sendFeedbackAndReload(email, question, ea[0], ea[1], ea[2], ea[3], ea[4], ea[5], ea[6]);
    } else {
        alert("Fill feedback at first please.")
    }
}

function addFeedbackFromInputFields(ea) {
    var inputFieldPosition = 1;
    for (var i = 0; i < ea.length; i++) {
        if (ea[i] == null || ea[i] == "") {
            for (inputFieldPosition; ; inputFieldPosition++) {
                if ($("#ea" + inputFieldPosition).length) {
                    if ($("#ea" + inputFieldPosition).val() != "") {
                        ea[i] = $("#ea" + inputFieldPosition).val();
                        inputFieldPosition++;
                        break;
                    } else {
                        continue;
                    }
                }
                break;
            }
        }
        if (i == 6 && ea[i] != "") {
            for (inputFieldPosition; ; inputFieldPosition++) {
                if ($("#ea" + inputFieldPosition).length) {
                    if ($("#ea" + inputFieldPosition).val() != "") {
                        ea[i] += "|" + $("#ea" + inputFieldPosition).val();
                    } else {
                        continue;
                    }
                } else {
                    break;
                }
            }
        }
    }
    return ea;
}


//checks if browser supports html5 storage
function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

//sends feedback to google form
function sendFeedbackAndReload(email, question, ea1, ea2, ea3, ea4, ea5, ea6, mca) {
    var LEmail = FIELDS_IDS[0];
    var LQuestion = FIELDS_IDS[1];
    var LEa = [];
    LEa[0] = FIELDS_IDS[2];
    LEa[1] = FIELDS_IDS[3];
    LEa[2] = FIELDS_IDS[4];
    LEa[3] = FIELDS_IDS[5];
    LEa[4] = FIELDS_IDS[6];
    LEa[5] = FIELDS_IDS[7];

    var LMca = FIELDS_IDS[8];

    var VEmail = encodeURIComponent(email);
    var VQuestion = encodeURIComponent(question);
    var VEa = [];
    VEa[0] = encodeURIComponent(ea1);
    VEa[1] = encodeURIComponent(ea2);
    VEa[2] = encodeURIComponent(ea3);
    VEa[3] = encodeURIComponent(ea4);
    VEa[4] = encodeURIComponent(ea5);
    VEa[5] = encodeURIComponent(ea6);

    var Vmca = encodeURIComponent(mca);

    var submitURL = (BASE_URL +
    LEmail + "=" + VEmail + "&" +
    LQuestion + "=" + VQuestion + "&" +
    LEa[0] + "=" + VEa[0] + "&" +
    LEa[1] + "=" + VEa[1] + "&" +
    LEa[2] + "=" + VEa[2] + "&" +
    LEa[3] + "=" + VEa[3] + "&" +
    LEa[4] + "=" + VEa[4] + "&" +
    LEa[5] + "=" + VEa[5] + "&" +
    LMca + "=" + Vmca +
    SUBMIT_REF);

    $.post(submitURL)
        .always(function () {
            window.location.href = createURL(null);
        });
}

//restores feedback to default state
function showFeedback(numberOfAnswers) {
    $('#feedback_area').css('display', 'inline');
    showAnswerFeedbackButton(numberOfAnswers);
    $('#askMeButton').parent().css("display", "none");
    $('#search').textinput('disable');
    $('#voice').prop('disabled', true).addClass('ui-disabled');
    $('#email').parent().css("width", "82%");
}

//click function on correct button
function clickActionCorrect(i) {
    feedbackButtons[i] = CORRECT_A;
    $('#feedbackButtonCorrect' + i).addClass("ui-icon-myapp-checked");
    $("#feedbackButtonCorrect" + i).removeClass('ui-icon-myapp-unchecked');
    $('#feedbackButtonCorrect' + i).css('background-position', '10% 50%');

    $('#feedbackButtonIncorrect' + i).addClass("ui-icon-myapp-unchecked");
    $("#feedbackButtonIncorrect" + i).removeClass('ui-icon-myapp-checked');
    $('#feedbackButtonIncorrect' + i).css('background-position', '8% 50%');

}

//click function on incorrect button
function clickActionIncorrect(i) {
    feedbackButtons[i] = INCORRECT_A;
    $('#feedbackButtonCorrect' + i).addClass("ui-icon-myapp-unchecked");
    $("#feedbackButtonCorrect" + i).removeClass('ui-icon-myapp-checked');
    $('#feedbackButtonCorrect' + i).css('background-position', '10% 50%');

    $('#feedbackButtonIncorrect' + i).addClass("ui-icon-myapp-checked");
    $("#feedbackButtonIncorrect" + i).removeClass('ui-icon-myapp-unchecked');
    $('#feedbackButtonIncorrect' + i).css('background-position', '8% 50%');

}

// shows feedback buttons near answer
function showAnswerFeedbackButton(numberOfAnswers) {
    feedbackButtons = [];
    for (var i = 0; i < numberOfAnswers; i++) {
        createFeedbackButton(i);
    }
}

//creates feedback buttons
function createFeedbackButton(i) {
    feedbackButtons[i] = INCORRECT_A;
    var feedbackButtonIncorrect = '<button class="ui-btn ui-mini ui-corner-all ui-icon-myapp-checked ui-btn-icon-left ui-btn-inline" id="feedbackButtonIncorrect' + i + '">Incorrect</button>';
    $("#feedbackButtonArea" + i).append(feedbackButtonIncorrect);
    $('#feedbackButtonIncorrect' + i).on('click', function (e) {
        clickActionIncorrect(i);
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    });

    var feedbackButtonCorrect = '<button class="ui-btn ui-mini ui-corner-all ui-icon-myapp-unchecked ui-btn-icon-left ui-btn-inline" id="feedbackButtonCorrect' + i + '">Correct</button>';
    $("#feedbackButtonArea" + i).append(feedbackButtonCorrect);
    $('#feedbackButtonCorrect' + i).on('click', function (e) {
        clickActionCorrect(i);
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    });
}


//returns array of correct answers
function getCorrectAnswers() {
    var corrects = [];
    var position = 0;
    for (var i = 0; i < feedbackButtons.length; i++) {
        if (feedbackButtons[i] == true) {
            if (position < 6) {
                corrects[position] = getAnswer(i);
                position++;
            } else {
                if (corrects[position] == null) {
                    corrects[position] = getAnswer(i);
                } else {
                    corrects[position] += "|" + getAnswer(i);
                }
            }
        }
    }
    if (position < 6) {
        for (var i = position; i < 7; i++) {
            corrects[i] = "";
        }
    }
    return corrects;
}

//gets text of answer on i position
function getAnswer(i) {
    return $('#answerText' + i).text();
}