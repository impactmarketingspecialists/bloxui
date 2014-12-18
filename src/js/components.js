+function($){

	var _DataTables = [];

	var DataTable = function(_table) {
		var $table = $(_table),
			_tools = $table.attr('am-Tools').split(' '),
			self = this;

		var _select = function(e){
			var em = $(e.target).parent();
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

		// $table[0].DataTable = this;
	};

	$(document).ready(function(){
		$('[am-DataTable]').each(function(index,table){
			_DataTables.push(new DataTable(table));
		});
	});
}(jQuery);