+function($){

	var _DataTables = [];

	var DataTable = function(_table) {
		var $table = $(_table),
			_tools = $table.attr('am-Tools').split(' '),
			self = this;

		if (_tools.indexOf('select-all') > -1 || _tools.indexOf('select-multi') > -1) {
			var _select = function(e){
				console.dir(e.target.nodeName);
				var em = (e.target.nodeName == 'INPUT') ? $(e.target).parent().parent() : $(e.target).parent();
				var val = (em.attr('am-Selected') == '') ? 'false' : em.attr('am-Selected');
				em.attr('am-Selected', (val === 'true')? 'false':'true');
				em.find('td:first-child input[type=checkbox]').prop('checked',(val === 'true')? false:true);
				
				if (_tools.indexOf('select-all') > -1) {
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


			if (_tools.indexOf('select-all') > -1) {
				$table.on('click','tbody tr td',_select);
				$table.find('thead tr th:first-child input[type=checkbox]').click(_selectAll);
			}
		}

		if (_tools.indexOf('drag-sort') > -1) {

			$table.tableDnD({
				dragHandle: '.dragHandle'
			});
			$table.observe('childlist', 'tbody tr', function(){
				$table.tableDnDUpdate();
			});
		}

		if (_tools.indexOf('edit-row') > -1 || _tools.indexOf('edit-cell') > -1) {

			if (_tools.indexOf('edit-row') > -1) {
				this.editRow = function(row) {
					$('td',row).attr('contenteditable', true);
				};
			}

			if (_tools.indexOf('edit-cell') > -1) {
				$table.observe('childlist', 'tbody tr', function(e){
					if (e.addedNodes.length) $(e.addedNodes[0]).find('td').attr('contenteditable', true);
				});
			}
		}

	};

	$(document).ready(function(){
		$('[am-DataTable][am-Tools~=drag-sort]').tableDnD();

		$('[am-DataTable]').each(function(index,table){
			_DataTables.push(new DataTable(table));
		});
	});
}(jQuery);