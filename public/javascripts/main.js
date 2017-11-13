$("#editSchedule").on("show.bs.modal", function (event) {
	var button = $(event.relatedTarget);
	var id = button.data("id");
	var day = button.data("day");
	var from = button.data("from");
	var to = button.data("to");
	var maxApp = button.data("max");
	var modal = $(this);
	modal.find(".modal-title").text("Edit " + day + " Schedule");
	modal.find(".modal-body input[name=from]").attr("value", from);
	modal.find(".modal-body input[name=to]").attr("value", to);
	modal.find(".modal-body input[name=maxApp]").attr("value", maxApp);
	modal.find(".modal-body input[name=id]").attr("value", id);
});

$("#compose").on("show.bs.modal", function (event) {
	var button = $(event.relatedTarget);
	var type = button.data("type");
	var time = button.data("time");
	var recipient = button.data("recipient");
	var modal = $(this);
	if (type === "cancel") {
		modal.find(".modal-body input[name=subject]").attr("value", "Cancelled Appointment").attr("readonly", true);
		modal.find(".modal-body input[name=time]").attr("value", time);
	} else {
		modal.find(".modal-body input[name=subject]").attr("value", "").attr("readonly", false);
		modal.find(".modal-body input[name=time]").attr("value", "");
	}
	modal.find(".modal-body input[name=recipient]").attr("value", recipient);
});

$("#viewMessageModal").on("show.bs.modal", function (event) {
	var button = $(event.relatedTarget);
	var subject = button.data("subject");
	var text = button.data("text");
	var modal = $(this);
	modal.find(".modal-body p[id=subject]").text(subject);
	modal.find(".modal-body p[id=text]").text(text);
});