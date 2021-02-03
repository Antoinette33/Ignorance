/**
 * jspsych-survey-text-longer
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */


jsPsych.plugins['survey-text-longer'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'survey-text-longer',
    description: '',
    parameters: {
      questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: 'Questions',
        default: undefined,
        nested: {
          prompt: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Prompt',
            default: undefined,
            description: 'Prompt for the subject to response'
          },
          value: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Value',
            default: "",
            description: 'The string will be used to populate the response field with editable answer.'
          },
          rows: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Rows',
            default: 1,
            description: 'The number of rows for the response text box.'
          },
          columns: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Columns',
            default: 40,
            description: 'The number of columns for the response text box.'
          }
        }
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Preamble',
        default: null,
        description: 'HTML formatted string to display at the top of the page above all the questions.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'The text that appears on the button to finish the trial.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    for (var i = 0; i < trial.questions.length; i++) {
      if (typeof trial.questions[i].rows == 'undefined') {
        trial.questions[i].rows = 10;
      }
    }
    for (var i = 0; i < trial.questions.length; i++) {
      if (typeof trial.questions[i].columns == 'undefined') {
        trial.questions[i].columns = 80;
      }
    }
    for (var i = 0; i < trial.questions.length; i++) {
      if (typeof trial.questions[i].value == 'undefined') {
        trial.questions[i].value = "";
      }
    }

    var html = '';
    // show preamble text
    if(trial.preamble !== null){
      html += '<div id="jspsych-survey-text-longer-preamble" class="jspsych-survey-text-longer-preamble">'+trial.preamble+'</div>';
    }
    // add questions
    for (var i = 0; i < trial.questions.length; i++) {
      html += '<div id="jspsych-survey-text-longer-"'+i+'" class="jspsych-survey-text-longer-question" style="margin: 2em 0em;">';
      html += '<p class="jspsych-survey-text-longer">' + trial.questions[i].prompt + '</p>';
      if(trial.questions[i].rows == 1){
        html += '<input type="text" name="#jspsych-survey-text-longer-response-' + i + '" size="'+trial.questions[i].columns+'" value="'+trial.questions[i].value+'"></input>';
      } else {
        html += '<textarea name="#jspsych-survey-text-longer-response-' + i + '" style="width:90%" rows="' + trial.questions[i].rows + '">'+trial.questions[i].value+'</textarea>';
      }
      html += '</div>';
    }

    // add submit button
    html += '<button id="jspsych-survey-text-longer-next" class="jspsych-btn jspsych-survey-text-longer">'+trial.button_label+'</button>';

    display_element.innerHTML = html;

    display_element.querySelector('#jspsych-survey-text-longer-next').addEventListener('click', function() {
      // measure response time
      var endTime = (new Date()).getTime();
      var response_time = endTime - startTime;

      // create object to hold responses
      let questionText = [];
      for(i = 0; i < trial.questions.length; i++){
        questionText = trial.questions[i].prompt
      };
      var question_data = {};
      var matches = display_element.querySelectorAll('div.jspsych-survey-text-longer-question');
      for(var index=0; index<matches.length; index++){
        var id = "Q" + index + " - " + questionText;
        var val = matches[index].querySelector('textarea, input').value;
        var obje = {};
        obje[id] = val;
        Object.assign(question_data, obje);
      }
      // save data
      var trialdata = {
        "rt": response_time,
        "responses": JSON.stringify(question_data)
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    });

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();
