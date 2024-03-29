cur_frm.add_fetch('patient', 'customer_name', 'patient_name')
cur_frm.add_fetch('doctor', 'lead_name', 'doctor_name')
cur_frm.add_fetch('referrer_name','rules','rules')
cur_frm.add_fetch('referrer_name','value','value')

cur_frm.fields_dict.radiologist_name.get_query = function(doc,cdt,cdn) {
	return{	query:"selling.doctype.patient_encounter_entry.patient_encounter_entry.get_employee"}
}
cur_frm.cscript.onload = function(doc, cdt, cdn) {
	cur_frm.cscript.referrer_name(doc)
	if(this.frm.doc.__islocal) {
		doc.encounter_date=get_today();
		

	}
}
/*cur_frm.cscript.refresh = function(doc){
	cur_frm.cscript.referrer_name(doc)
}*/
cur_frm.add_fetch('radiologist_name', 'employee_name', 'radiologist_');
cur_frm.add_fetch('referrer_name', 'lead_name', 'referral');
cur_frm.add_fetch('technologist', 'employee_name', 'technologist_name');
cur_frm.add_fetch('appointment_slot', 'start_time', 'start_time');
cur_frm.add_fetch('appointment_slot', 'end_time', 'end_time');
cur_frm.get_field("technologist").get_query=function(doc,cdt,cdn)
{
   return "select employee from `tabEmployee` where designation= 'Technologist' "
}

cur_frm.get_field("encounter").get_query=function(doc,cdt,cdn)
{
   return "select name from `tabModality` where active='Yes'"
}

cur_frm.get_field("study").get_query=function(doc,cdt,cdn)
{
   return "select name from `tabStudy` where modality= '"+doc.encounter+"' "
}

cur_frm.get_field("appointment_slot").get_query=function(doc,cdt,cdn){

//	return "select name from tabSlots where modality='"+doc.encounter+"' and active='Yes' and study='"+doc.study+"'"
	return "select name from tabSlots where modality='"+doc.encounter+"' and active='Yes' and study='"+doc.study+"' and name not in (SELECT slot FROM `tabSlot Child` where status='Confirm' and start_time not like (date_format(sysdate(),'%Y-%m-%d %H:%i')))"
}

cur_frm.cscript.rules = function(doc){
	 cur_frm.cscript.referrer_name(doc)
}

var a={"patient_data":". Patient Details","encounter_data":". Encounter Details","referral_fee_data":". Patient History","disc":". Notes"};

cur_frm.cscript.disc=function(doc,cdt,cdn){
make_linking('disc')

}

function make_linking(show_key){
		
                for (var key in a)
                {
                        console.log(key)
                        $('button[data-fieldname='+key+']').css("width","200");
                        if(key==show_key)
                        {
				if(key=='encounter_data')
				{
					$(".row:contains('"+a[key]+"')").show();
					$(".row:contains('. Other Info')").show()
					$(".row:contains('. Alerts')").show()
					$(".row:contains('. Procedure')").show()
					$(".row:contains('. Send Report By')").show()
				}
				else
				{
                                	$(".row:contains('"+a[key]+"')").show();
					$(".row:contains('. Other Info')").hide()
                                        $(".row:contains('. Alerts')").hide()
                                        $(".row:contains('. Procedure')").hide()
					$(".row:contains('. Send Report By')").hide()
				}
                        }
                        else
                        {	
                                $(".row:contains('"+a[key]+"')").hide()

                        }
                }

        }

cur_frm.cscript.patient_data=function(doc,cdt,cdn){
make_linking('patient_data')

}

cur_frm.cscript.referral_fee_data=function(doc,cdt,cdn){

make_linking('referral_fee_data')
}

cur_frm.cscript.encounter_data=function(doc,cdt,cdn){
make_linking('encounter_data')

}

cur_frm.cscript.refresh = function(doc, cdt, cdn){
	cur_frm.cscript.referrer_name(doc)
        cur_frm.appframe.add_primary_action(wn._('Make Bill'), cur_frm.cscript['Make Bill'])
	setTimeout(function(){
                        for (var key in a)
                        {
                                $('button[data-fieldname='+key+']').css("width","200");
                        }

                },10);
	
	

}

cur_frm.cscript['Make Bill'] = function() {
        var doc = cur_frm.doc
        var si = wn.model.make_new_doc_and_get_name('Sales Invoice');
        si = locals['Sales Invoice'][si];
        si.customer = cur_frm.doc.patient;
        si.posting_date = dateutil.obj_to_str(new Date());
	si.discount_as_amount = cur_frm.doc.discount_as_amount;
	si.discount_in_percent = cur_frm.doc.discount_in_percent;
	si.discount_type = cur_frm.doc.discount_type;
  
        var d1 = wn.model.add_child(si, 'Sales Invoice Item', 'entries');
        d1.item_code = cur_frm.doc.encounter
	
	loaddoc('Sales Invoice', si.name);
}

/*cur_frm.cscript.checked_in = function(doc,dt,dn){
    
	wn.call({
			method: "selling.doctype.patient_encounter_entry.patient_encounter_entry.update_event",
			args:{checked:doc.checked_in,dname:doc.eventid,encounter:doc.name},
			callback: function(r) {
				console.log("done")
			}
		});
  
}*/
cur_frm.cscript.referrer_name = function(doc){
	hide_field('discount_in_percent')
	unhide_field('discount_as_amount')
	if(doc.rules=='Percentage'){
		unhide_field('discount_in_percent')
		hide_field('discount_as_amount');
	}
}

