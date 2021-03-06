function ModalDialog(selector) {
	this.selector = selector;
	this.$element = $(selector);
	this.$header = $(selector).find('.modal-header h3');
	this.$contentBody = $(selector).find('.modal-body');
	this.$footer = $(selector).find('.modal-footer');
	var self = this;

	this.setContent = function(contentHTML) {
		self.$contentBody.html(contentHTML);

		return self;
	};

	this.setHeader = function(header) {
		this.$header.text(header);

		return self;
	};

	this.setFooter = function(footerHTML) {
		this.$footer.html(footerHTML);

		return self;
	};

	this.show = function() {
		this.$element.modal();
	}
}


function formatBytes(bytesAmount) {
	var suffixes = ['bytes', 'KB', 'MB', 'GB'];
	var counter = Math.floor(Math.pow(bytesAmount, 0.1) / 2);
	bytesAmount = Math.round(bytesAmount / Math.pow(2, counter * 10) * 100) / 100;

	return bytesAmount + ' ' + suffixes[counter];
}

function step1checkingCallback(params) {
	if (params.result) {
		changeProgress(0, 'Trying to download file...');
		getDownloadProgress();
	} else {
		showError('Connection failed');
	}
}

function getDownloadProgress() {
	var srcHost = $('#srcHost').val();
	var srcLogin = $('#srcLogin').val();
	var srcPassword = $('#srcPassword').val();
	var srcFile = $('#srcDir').val();

	if (srcLogin == '') {
		srcLogin = 'anonymous';
	}

	var today = new Date();
	var id = today.getTime();

	$('#progressData').load('ajax.php',
		'operation=downloadfile' +
		'&srcHost=' + srcHost +
		'&srcLogin=' + srcLogin +
		'&srcPassword=' + srcPassword +
		'&srcFile=' + srcFile +
		'&id=' + id
	);

	var appInterval = setInterval(function () {
		var jqxr = $.getJSON('ajax.php?operation=get_progress&id=' + id);

		jqxr.done(function (data) {
			if ((data.id + '') !== (id + '')) {

				return;
			}

			if (data.downloaded == data.filesize) {
				showSuccess('File is downloaded');
				clearTimeout(appInterval);

				return;
			}

			var downloadingMessage = 'Downloading file... [';
			downloadingMessage += formatBytes(data.downloaded) + " / " + formatBytes(data.filesize) + "]";
			changeProgress(data.progress, downloadingMessage);
		})
	}, 1000);
}

function testingCallback(params) {
	$('#' + params.serverType + 'Test .preloader').hide();
	if (params.result) {
		showSuccess('Connection successful');
	} else {
		showError('Connection failed');
	}
}

function browsingCallback(params) {
	$('#' + params.serverType + 'Browse .preloader').hide();
	if (params.result) {
		showTreeDialog(params.serverType);
	} else {
		showError('Connection failed');
	}
}

function testConnection(serverType, callback, params) {
	var host = $('#' + serverType + 'Host').val();
	var login = $('#' + serverType + 'Login').val();
	var password = $('#' + serverType + 'Password').val();
	var srvType = (serverType == 'src') ? 'source' : 'destination';

	var jqxr = $.ajax({
		url: "ajax.php",
		dataType: 'json',
		data: {
			'server': srvType,
			'host': host,
			'login': login,
			'password': password
		}
	});

	params.serverType = serverType;
	params.result = false;

	jqxr.done(function (data) {
		if (data.status === 'success') {
			params.result = true;
			callback(params);
		} else {
			params.result = false;
			callback(params);
		}
	});
}

function showMessageBox(title, message, type) {
	(new ModalDialog('#popupWindow'))
		.setHeader(title)
		.setContent('<p class="' + type + '-message">' + message + '</p>')
		.setFooter('<a href="#" class="btn" data-dismiss="modal">Ok</a>')
		.show();
}

function showError(message) {
	showMessageBox('Error', message, 'error');
}

function showInfo(message) {
	showMessageBox('Information', message, 'info');
}

function showSuccess(message) {
	showMessageBox('Operation succeeded', message, 'success');
}

function showTreeDialog(serverType) {
	var host = $('#' + serverType + 'Host').val();
	var login = $('#' + serverType + 'Login').val();
	var password = $('#' + serverType + 'Password').val();
	var $popupWindow = $('#popupWindow');

	var srvType = (serverType == 'src') ? 'source' : 'destination';
	$popupWindow.find('.modal-header h3').html('Choosing files on ' + srvType + ' server');
	$popupWindow.find('.modal-body').html('<div id="fsTree"></div><div id="fsFileinfo"></div>');
	var footerContent = '<a href="#" class="btn" data-dismiss="modal">Cancel</a>';
	footerContent += '<a id="selectBtn" href="#" class="btn btn-primary disabled">Select</a>';
	$popupWindow.find('.modal-footer').html(footerContent);
	$('#fsFileinfo').data('servertype', serverType);
	$popupWindow.modal();

	$('#selectBtn').on('click', function (e) {
		if ($(this).hasClass('disabled')) {
			return;
		}

		$('#' + serverType + 'Dir').val($('#fsFileinfo').data('path'));
		$('#popupWindow').modal('hide');
	});

	$('#fsTree').bind('select_node.jstree', function (event, data) {
		var path = data.rslt.obj.attr('path');
		var type = data.rslt.obj.attr('rel');
		var $selectionButton = $('#selectBtn');

		if ((type == 'default' && serverType == 'src') || (type == 'folder' && serverType == 'dst')) {
			$selectionButton.removeClass('disabled');
			$('#fsFileinfo').data('path', path);
		} else {
			if (!$selectionButton.hasClass('disabled')) {
				$selectionButton.addClass('disabled');
			}
			$('#fsFileinfo').data('path', '');
		}
	})

		.jstree({
			plugins: ["themes", "json_data", "ui", "types"],
			"json_data": {
				"ajax": {
					"url": "ajax.php",
					"data": function (n) {
						var id = '';
						var path = '';
						if (n.attr) {
							id = n.attr("id").replace("node_", "");
							path = n.attr("path");
						} else {
							id = 1;
							path = "/";
						}

						return {
							"server": srvType,
							"host": host,
							"login": login,
							"password": password,
							"operation": "get_filelist",
							"id": id,
							"path": path
						};
					}
				}
			},

			"types": {
				"max_depth": -2,
				"max_children": -2,
				"valid_children": ["drive"],
				"types": {
					"default": {
						"valid_children": "none",
						"icon": {
							"image": "img/file.png"
						}
					},
					"folder": {
						"valid_children": ["default", "folder"],
						"icon": {
							"image": "img/folder.png"
						}
					}
				}
			}
		});
}

function showProgressBar(message) {
	var content = '<p><span id="progressMessage">Checking connection to source server...</span> <span id="progressLabel" class="pull-right hide">0%</span></p>';
	content += '<div class="progress progress-success progress-striped active"><div id="progressBar" class="bar" style="width: 0"></div></div>';
	content += '<div id="progressData"></div>';

	(new ModalDialog('#popupWindow'))
		.setHeader('Please wait')
		.setContent(content)
		.setFooter('')
		.show();
}

function changeProgress(progress, message) {
	var $progressLabel = $('#progressLabel');
	if ($progressLabel.hasClass('hide')) {
		$progressLabel.removeClass('hide');
	}

	$progressLabel.text(progress + '%');
	$('#progressMessage').html(message);
	$('#progressBar').width(progress + '%');
}

$(function () {
	$('#srcTest').click(function (e) {
		e.preventDefault();
		$('#srcTest').find('.preloader').show();
		testConnection('src', testingCallback, {});
	});

	$('#dstTest').click(function (e) {
		e.preventDefault();
		$('#dstTest').find('.preloader').show();
		testConnection('dst', testingCallback, {});
	});

	$('#srcBrowse').click(function (e) {
		e.preventDefault();
		$('#srcBrowse').find('.preloader').show();
		testConnection('src', browsingCallback, {});
	});

	$('#dstBrowse').click(function (e) {
		e.preventDefault();
		$('#dstBrowse').find('.preloader').show();
		testConnection('dst', browsingCallback, {});
	});

	$('#startProcess').click(function (e) {
		var srcHost = $('#srcHost').val();
		var srcLogin = $('#srcLogin').val();
		var srcPassword = $('#srcPassword').val();
		var srcFile = $('#srcDir').val();

		if (srcLogin == '') {
			srcLogin = 'anonymous';
		}

		if (srcFile === '') {
			showError('You need to select file on remote server!');

			return;
		}

		showProgressBar();
		testConnection('src', step1checkingCallback, {});
	});
});
