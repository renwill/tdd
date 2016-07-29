// Constructor
function VoyageSVVD(p_svc_loop,p_vsl_cde,p_voy_num,p_dir_bound,p_call_num,p_call_port) {
  this.svc_loop =  p_svc_loop;
  this.vsl_cde = p_vsl_cde;
  this.voy_num = p_voy_num;
  this.dir_bound = p_dir_bound;
  this.call_num = p_call_num;
  this.call_port = p_call_port;
}

// class methods
VoyageSVVD.prototype.showSVVD = function() {
  return (this.svc_loop.trim() + '    ').slice(0,4)
                +this.vsl_cde.trim()
                +this.voy_num.trim()
                +this.dir_bound.trim().substring(0,1);
};

VoyageSVVD.prototype.showSVVDCC = function() {
    return (this.svc_loop.trim() + '    ').slice(0,4)
        +this.vsl_cde.trim()
        +this.voy_num.trim()
        +this.dir_bound.trim().substring(0,1)
        +('00'+this.call_num.trim()).slice(-2)
        +this.call_port;
};

// export the class
module.exports = VoyageSVVD;