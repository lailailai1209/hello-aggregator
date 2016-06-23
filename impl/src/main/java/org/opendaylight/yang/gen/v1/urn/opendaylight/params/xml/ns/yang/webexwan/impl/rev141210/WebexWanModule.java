package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.webexwan.impl.rev141210;

import org.opendaylight.webexwan.impl.WebexWanProvider;

public class WebexWanModule extends org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.webexwan.impl.rev141210.AbstractWebexWanModule {
    public WebexWanModule(org.opendaylight.controller.config.api.ModuleIdentifier identifier, org.opendaylight.controller.config.api.DependencyResolver dependencyResolver) {
        super(identifier, dependencyResolver);
    }

    public WebexWanModule(org.opendaylight.controller.config.api.ModuleIdentifier identifier, org.opendaylight.controller.config.api.DependencyResolver dependencyResolver, org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.webexwan.impl.rev141210.WebexWanModule oldModule, java.lang.AutoCloseable oldInstance) {
        super(identifier, dependencyResolver, oldModule, oldInstance);
    }

    @Override
    public void customValidation() {
        // add custom validation form module attributes here.
    }

    @Override
    public java.lang.AutoCloseable createInstance() {
        WebexWanProvider provider = new WebexWanProvider();
        getBrokerDependency().registerProvider(provider);
        return provider;
    }

}
