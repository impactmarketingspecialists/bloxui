+function($){

	var _DataTables = [];

	$.fn.DataTable = function(options) {

		var $table = this;
		var settings = $.extend({
			tools: [],
			sortable: false
		}, options);

		if (this.attr('am-Tools')) {
			$.merge(settings.tools, this.attr('am-Tools').split());
		}

		if (settings.tools.indexOf('select-all') > -1 || settings.tools.indexOf('select-multi') > -1) {

			var _select = function(e){
				var em = (e.target.nodeName == 'INPUT') ? $(e.target).parent().parent() : $(e.target).parent();
				var val = (em.attr('am-Selected') == '') ? 'false' : em.attr('am-Selected');
				em.attr('am-Selected', (val === 'true')? 'false':'true');
				em.find('td:first-child input[type=checkbox]').prop('checked',(val === 'true')? false:true);
				
				if (settings.tools.indexOf('select-all') > -1) {
					if (val === 'true') $table.find('thead tr th:first-child input[type=checkbox]').prop('checked',false);
				}
			};

			var _selectAll = function(e){
				var em = $(e.target);
				$table.find('tbody tr').attr('am-Selected',em.prop('checked').toString()).
				find('td:first-child input[type=checkbox]').prop('checked',em.prop('checked'))
			};

			this.selected = function(){
				return $table.find('tbody tr[am-Selected=true]');
			}

			if (settings.tools.indexOf('select-all') > -1) {
				$table.on('click','tbody tr td',_select);
				$table.find('thead tr th:first-child input[type=checkbox]').click(_selectAll);
			}
		}

		if (settings.tools.indexOf('drag-sort') > -1) {

			$table.tableDnD({
				dragHandle: '.dragHandle'
			});
			$table.observe('childlist', 'tbody tr', function(){
				$table.tableDnDUpdate();
			});
		}

		if (settings.tools.indexOf('edit-row') > -1 || settings.tools.indexOf('edit-cell') > -1) {

			if (settings.tools.indexOf('edit-row') > -1) {
				this.editRow = function(row) {
					$('td:not(.table-control)',row).attr('contenteditable', true);
				};
			}

			if (settings.tools.indexOf('edit-cell') > -1) {
				$table.observe('childlist', 'tbody tr', function(e){
					if (e.addedNodes.length) $(e.addedNodes[0]).find('td:not(.table-control)').attr('contenteditable', true);
				});
			}
		}
		return this;
	};

	$(document).ready(function(){
		$('[am-DataTable][am-Tools~=drag-sort]').tableDnD();
		$('[am-DataTable]').DataTable();
	});
}(jQuery);
jQuery.noConflict(true);