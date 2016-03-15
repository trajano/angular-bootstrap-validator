Package.describe({
    name: "trajano:angular-bootstrap-validator",
    summary: "Provides a directive that enables validations using AngularJS with forms that are marked up.",
    version: "1.0.2",
    git: "https://github.com/trajano/angular-bootstrap-validator",
    documentation: "README.md"
});

Package.onUse( function( api ) {
    api.versionsFrom( '1.2.1' );
    api.use(['jquery', 'angular@1.3.7', 'twbs:bootstrap@3.3.6']);
    api.addFiles( [ "angular-bootstrap-validator.js" ], [ 'client' ] );
});