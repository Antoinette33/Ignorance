/**
 * jspsych-audioplayers-button-response
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["audioplayers-button-response"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'audioplayers-button-response',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      choices: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Choices',
        default: undefined,
        array: true,
        description: 'The labels for the buttons.'
      },
      button_html: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button HTML',
        default: '<button class="jspsych-btn">%choice%</button>',
        array: true,
        description: 'The html of the button. Can create own style.'
      },
			prompt1: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt1',
        default: null,
        description: 'Text before instrument name.'
      },
			instrument: {
				type: jsPsych.plugins.parameterType.STRING,
				pretty_name: 'Instrument',
				default: null,
				description: 'Instrument name.'
			},
			prompt2: {
				type: jsPsych.plugins.parameterType.STRING,
				pretty_name: 'Prompt2',
				default: null,
				description: 'Text after instrument name.'
			},
			audioLabel1: {
				type: jsPsych.plugins.parameterType.STRING,
				pretty_name: 'audioLabel1',
				default: null,
				description: 'Label for audio player 1.'
			},
			audio1: {
				type: jsPsych.plugins.parameterType.STRING,
				pretty_name: 'Audio1',
				default: null,
				description: 'First audio player.'
			},
			audioLabel2: {
				type: jsPsych.plugins.parameterType.STRING,
				pretty_name: 'audioLabel2',
				default: null,
				description: 'Label for audio player 2.'
			},
			audio2: {
				type: jsPsych.plugins.parameterType.STRING,
				pretty_name: 'Audio2',
				default: null,
				description: 'Second audio player.'
			},
      prompt3: {
				type: jsPsych.plugins.parameterType.STRING,
				pretty_name: 'Prompt3',
				default: null,
				description: 'Text after players'
			},
      prompt_top: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt top',
        default: null,
        description: 'Text above buttons.'
      },
      prompt_bottom: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt bottom',
        default: null,
        description: 'Text below buttons.'
      },
			stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      margin_vertical: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin vertical',
        default: '0px',
        description: 'The vertical margin of the button.'
      },
      margin_horizontal: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin horizontal',
        default: '8px',
        description: 'The horizontal margin of the button.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, then trial will end when user responds.'
      },
    }
  }

	plugin.trial = function(display_element, trial) {

    // display stimulus
    var html = '<div id="jspsych-audioplayers-button-response-stimulus">'+trial.stimulus+'</div>';
		//add prompt1
		if (trial.prompt1 !== null) {
			html += trial.prompt1;
		}
		//add instrument
		if (trial.instrument !== null) {
			html += trial.instrument;
		}
		//add prompt2
		if (trial.prompt2 !== null) {
			html += trial.prompt2;
		}
    //add audioLabel1
    if (trial.audioLabel1 !== null) {
      html += trial.audioLabel1;
    }
    //add audio1
    if (trial.audio1 !== null) {
      html += '<br><audio controls controlsList="nodownload"><source src='+trial.audio1+'></audio>';
    }
    //add audioLabel2
    if (trial.audioLabel2 !== null) {
      html += ''+trial.audioLabel2+'<br>';
    }
    //add audio2
    if (trial.audio2 !== null) {
      html += '<audio controls controlsList="nodownload"><source src='+trial.audio2+'></audio><br>';
    }
    //add prompt2
		if (trial.prompt3 !== null) {
			html += trial.prompt3;
		}

        //prompt
        if (trial.prompt_top !== null) {
          html += trial.prompt_top;
        }

        //display buttons
        var buttons = [];
        if (Array.isArray(trial.button_html)) {
          if (trial.button_html.length == trial.choices.length) {
            buttons = trial.button_html;
          } else {
            console.error('Error in html-button-response-vert plugin. The length of the button_html array does not equal the length of the choices array');
          }
        } else {
          for (var i = 0; i < trial.choices.length; i++) {
            buttons.push(trial.button_html);
          }
        }
       // html += '<div id="jspsych-html-button-response-vert-btngroup">';
       for (var i = 0; i < trial.choices.length; i++) {
         var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
         html += '<td><p><div class="jspsych-html-button-response-vert-button" align="center" style="display: inline-block; margin:'+trial.margin_vertical+' '+trial.margin_horizontal+'" id="jspsych-html-button-response-vert-button-' + i +'" data-choice="'+i+'">'+str+'</td></div></p>';
       }
        //html += '</div>';

      	//prompt
        if (trial.prompt_bottom !== null) {
          html += trial.prompt_bottom;
        }

		display_element.innerHTML = html;

		    // start time
		    var start_time = Date.now();

        // add event listeners to buttons
        for (var i = 0; i < trial.choices.length; i++) {
          display_element.querySelector('#jspsych-html-button-response-vert-button-' + i).addEventListener('click', function(e){
            // either have another variable that saves the button label for the button pressed, or update choice to save the button label instead of the event

    		  var response_label = trial.choices[e.currentTarget.getAttribute('data-choice')];
            var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
            after_response(choice, response_label);
          });
        }

		    // store response
		    var response = {
		      rt: null,
		      button: null
		    };

		    // function to handle responses by the subject
		    function after_response(choice) {

		      // measure rt
		      var end_time = Date.now();
		      var rt = end_time - start_time;
		      response.button = choice;
		      response.rt = rt;

		      // after a valid response, the stimulus will have the CSS class 'responded'
		      // which can be used to provide visual feedback that a response was recorded
		      display_element.querySelector('#jspsych-audioplayers-button-response-stimulus').className += ' responded';

		      // disable all the buttons after a response
		      var btns = document.querySelectorAll('.jspsych-audioplayers-button-response-button button');
		      for(var i=0; i<btns.length; i++){
		        //btns[i].removeEventListener('click');
		        btns[i].setAttribute('disabled', 'disabled');
		      }

		      if (trial.response_ends_trial) {
		        end_trial();
		      }
		    };

		    // function to end trial when it is time
		    function end_trial() {

		      // kill any remaining setTimeout handlers
		      jsPsych.pluginAPI.clearAllTimeouts();

		      // gather the data to store for the trial
		      var trial_data = {
		        "rt": response.rt,
		        "stimulus": trial.stimulus,
		        "button_pressed": response.button
		      };

		      // clear the display
		      display_element.innerHTML = '';

		      // move on to the next trial
		      jsPsych.finishTrial(trial_data);
		    };

		    // hide image if timing is set
		    if (trial.stimulus_duration !== null) {
		      jsPsych.pluginAPI.setTimeout(function() {
		        display_element.querySelector('#jspsych-audioplayers-button-response-stimulus').style.visibility = 'hidden';
		      }, trial.stimulus_duration);
		    }

		    // end trial if time limit is set
		    if (trial.trial_duration !== null) {
		      jsPsych.pluginAPI.setTimeout(function() {
		        end_trial();
		      }, trial.trial_duration);
		    }

		  };

		  return plugin;
		})();
