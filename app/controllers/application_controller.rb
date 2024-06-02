class ApplicationController < ActionController::Base
  config.action_controller.default_url_options = { host: 'kkappservice.com', protocol: 'https' }
  
  before_action :configure_permitted_parameters, if: :devise_controller?

  private
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:nickname])
  end
end
